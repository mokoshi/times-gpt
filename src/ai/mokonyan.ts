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

  private async getBotContext() {
    if (!this.botContextId) {
      throw new Error("BotContext is not set");
    }
    return await this.botContextRepository.fetch(this.botContextId);
  }

  async restoreTalk() {
    this.logger.debug("Restore talk!");
    this.botContextId = 1;
  }

  async startTalk(assistantId: string, initialMessage: string) {
    this.logger.debug("Start new talk!", { assistantId, initialMessage });

    const thread = await this.openai.createThread(initialMessage);
    this.logger.debug("Created openai.thread", { threadId: thread.id });

    this.botContextId = await this.botContextRepository.create(
      assistantId,
      thread.id
    );
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
    } else {
      const assistants = await this.openai.listAssistant();
      const assistant = assistants[0];
      this.logger.debug("Selected assistant", {
        assistantId: assistant.id,
        assistantDescription: assistant.description,
      });
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
    const run = await this.openai.runThreadAndWait(threadId, assistantId);
    if (!run) {
      this.logger.warn("Failed to finish run");
      return;
    }
    this.logger.debug("Run finished", { runId: run.id });

    await this.botContextRepository.save(botContextId, { runId: run.id });

    if (run?.required_action) {
      this.logger.debug("Action required!", {
        requiredAction: run.required_action,
      });
      if (run.required_action.type === "submit_tool_outputs") {
        const toolOutputs: OpenAI.Beta.Threads.RunSubmitToolOutputsParams.ToolOutput[] =
          [];
        for (const toolCall of run.required_action.submit_tool_outputs
          .tool_calls) {
          this.logger.debug("Will call function", { toolCall });

          const output = await this.functionHandler.callFunction({
            name: toolCall.function.name as any,
            params: JSON.parse(toolCall.function.arguments),
          });
          toolOutputs.push({ output, tool_call_id: toolCall.id });
        }

        const submitResult = await this.openai.submitToolOutputs(
          threadId,
          run.id,
          toolOutputs
        );
        this.logger.debug("Submitted tool outputs", {
          threadId,
          runId: submitResult.id,
          toolOutputs,
        });
        await this.openai.waitForRun(threadId, submitResult.id);
      }
    }
  }

  async addMessage(message: string) {
    this.logger.debug("Add message!");

    const { threadId } = await this.getBotContext();

    await this.openai.addThreadMessage(threadId, message);
  }

  async getUnreadMessages() {
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
}
