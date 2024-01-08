import { AssistantDefs } from "./assistant-defs";
import { autoInjectable, inject } from "tsyringe";
import { OpenAIClient } from "./openai-client";
import { Logger } from "../logger";
import { type BotContextRepository } from "./bot-context-repository/bot-context-repository";
import { FunctionHandler } from "../function-handler/function-handler";
import OpenAI from "openai";

@autoInjectable()
export class Mokonyan {
  private openai: OpenAIClient;
  private logger: Logger;
  private botContextRepository: BotContextRepository;
  private botContextId: number | null = null;
  private functionHandler: FunctionHandler;

  constructor(
    @inject("OpenAIClient") openai?: OpenAIClient,
    @inject("Logger") logger?: Logger,
    @inject("BotContextRepository") ctx?: BotContextRepository,
    @inject("FunctionHandler") functionHandler?: FunctionHandler
  ) {
    this.openai = openai!;
    this.logger = logger!;
    this.botContextRepository = ctx!;
    this.functionHandler = functionHandler!;
  }

  /**
   * 本日の botContext を作成 or 取得し、内部状態にセットする
   * 作成する場合は、 thread も同時に作成する
   */
  async bootstrap(assistantId: string) {
    this.logger.debug("Bootstrap!");

    const latestContext = await this.botContextRepository.fetchLatest();
    if (!latestContext || !this.isContextToday(latestContext)) {
      this.logger.info("No context found today. Create new context.");
      // TODO: assistantId をどこかから渡せるようにしたいね
      this.botContextId = await this.startNewContext(assistantId);
    } else {
      this.logger.info("Today's context found.", {
        botContextId: latestContext.id,
      });
      this.botContextId = latestContext.id;
    }
  }

  async prepareForAssistant(createNew = false) {
    if (createNew) {
      const assistant = await this.openai.createAssistant(
        AssistantDefs.mokonyan
      );
      this.logger.debug("Created new assistant", {
        assistantId: assistant.id,
        assistantDescription: assistant.description,
      });
      return assistant.id;
    } else {
      const assistants = await this.openai.listAssistant();
      const assistant = assistants[0];
      this.logger.debug("Selected assistant", {
        assistantId: assistant.id,
        assistantDescription: assistant.description,
      });
      return assistant.id;
    }
  }

  async think() {
    this.logger.debug("Start think!");

    const {
      id: botContextId,
      assistantId,
      threadId,
    } = await this.getBotContext();

    this.logger.debug("Run start");
    let run = await this.openai.runThreadAndWait(threadId, assistantId);
    if (!run) {
      this.logger.warn("Failed to finish run");
      return;
    }
    this.logger.debug("Run finished", { runId: run.id });

    await this.botContextRepository.save(botContextId, { runId: run.id });

    while (run?.required_action) {
      this.logger.debug("Action required!", {
        requiredAction: run.required_action,
      });
      if (run.required_action.type === "submit_tool_outputs") {
        const toolOutputs: OpenAI.Beta.Threads.RunSubmitToolOutputsParams.ToolOutput[] =
          [];
        for (const toolCall of run.required_action.submit_tool_outputs
          .tool_calls) {
          this.logger.debug("Will call function", { toolCall });

          let params = {};
          try {
            params =
              toolCall.function.arguments === ""
                ? {}
                : JSON.parse(toolCall.function.arguments);
          } catch {
            this.logger.error("Failed to parse arguments", {
              arguments: toolCall.function.arguments,
            });
          }

          const output = await this.functionHandler.callFunction({
            name: toolCall.function.name as any,
            params,
          });
          toolOutputs.push({ output, tool_call_id: toolCall.id });
        }

        run = await this.openai.submitToolOutputs(
          threadId,
          run.id,
          toolOutputs
        );
        this.logger.debug("Submitted tool outputs", {
          threadId,
          runId: run.id,
          toolOutputs,
        });
        run = await this.openai.waitForRun(threadId, run.id);
      }
    }
  }

  async addMessage(message: string) {
    this.logger.debug("Add message!", { message });

    const { threadId } = await this.getBotContext();

    await this.openai.addThreadMessage(threadId, message);
  }

  async getUnreadMessages(opts: { role?: "user" | "assistant" } = {}) {
    this.logger.debug("Get unread messages!");

    const {
      id: botContextId,
      threadId,
      messageReadAt,
    } = await this.getBotContext();

    const page = await this.openai.listThreadMessages(threadId);
    const messages: { role: "user" | "assistant"; message: string }[] = [];
    for (const message of page.data) {
      // message は降順にソートされていることを前提に、
      // 前回読んだメッセージよりも古いメッセージが出てきたら終了する
      if (message.created_at <= messageReadAt) {
        break;
      }
      if (opts.role) {
        if (message.role !== opts.role) {
          continue;
        }
      }

      for (const content of message.content) {
        if (content.type === "image_file") {
          messages.push({
            role: message.role,
            message: `画像はまだ未対応だよ: file_id: ${content.image_file.file_id}`,
          });
        } else {
          messages.push({
            role: message.role,
            // annotation 無視してる
            message: content.text.value,
          });
        }
      }
    }

    await this.botContextRepository.save(botContextId, {
      messageReadAt: Date.now() / 1000,
    });

    return messages;
  }

  private async startNewContext(assistantId: string) {
    this.logger.debug("Start new thread!", { assistantId });

    const thread = await this.openai.createThread();
    this.logger.debug("Created openai.thread.", { threadId: thread.id });

    const botContextId = await this.botContextRepository.create(
      assistantId,
      thread.id
    );
    this.logger.debug("Created botContext.", { botContextId });

    return botContextId;
  }

  private async getBotContext() {
    if (!this.botContextId) {
      throw new Error("BotContext is not set");
    }
    return await this.botContextRepository.fetch(this.botContextId);
  }

  private isContextToday(ctx: { date: string }) {
    const now = new Date();
    const date = new Date(ctx.date);
    // 朝の4時までは前日とみなす
    if (now.getHours() < 4) {
      now.setDate(now.getDate() - 1);
    }
    return (
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate()
    );
  }
}
