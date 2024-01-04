import OpenAI from "openai";
import { sleep } from "../util/sleep";
import { RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs";
import { autoInjectable, inject } from "tsyringe";
import { Logger } from "../logger";

@autoInjectable()
export class OpenAIClient {
  private readonly openai: OpenAI;
  private readonly logger: Logger;

  constructor(apiKey: string, @inject("Logger") logger?: Logger) {
    this.openai = new OpenAI({ apiKey });
    this.logger = logger!;
  }

  async getReply(text: string) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "あなたは優秀な秘書です。ユーザーの業務を総合的にサポートしてください。タスク管理を効率化したり、ユーザーを励ますことも大切です。",
        },
        { role: "user", content: text },
      ],
      model: "gpt-4-1106-preview",
    });

    return completion;
  }

  async createAssistant(params: OpenAI.Beta.AssistantCreateParams) {
    return await this.openai.beta.assistants.create(params);
  }

  async listAssistant() {
    const assistants = await this.openai.beta.assistants.list();
    return assistants.data;
  }

  async createThread(initialMessage?: string) {
    return await this.openai.beta.threads.create({
      messages: initialMessage
        ? [
            {
              role: "user",
              content: initialMessage,
            },
          ]
        : [],
    });
  }

  async runThread(threadId: string, assistantId: string) {
    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      // model: "gpt-4-1106-preview",
      // instructions: "New instructions that override the Assistant instructions",
      // tools: [{ type: "code_interpreter" }, { type: "retrieval" }],
    });
    return run;
  }

  async runThreadAndWait(threadId: string, assistantId: string) {
    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    return await this.waitForRun(threadId, run.id);
  }

  async submitToolOutputs(
    threadId: string,
    runId: string,
    toolOutputs: RunSubmitToolOutputsParams.ToolOutput[]
  ) {
    return await this.openai.beta.threads.runs.submitToolOutputs(
      threadId,
      runId,
      { tool_outputs: toolOutputs }
    );
  }

  async listThreadMessages(threadId: string) {
    return await this.openai.beta.threads.messages.list(threadId);
  }

  async addThreadMessage(threadId: string, message: string) {
    return await this.openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });
  }

  async listRuns(threadId: string) {
    const runs = await this.openai.beta.threads.runs.list(threadId);
    return runs;
  }

  async waitForRun(threadId: string, runId: string) {
    let sleepTime = 1000;
    for (let i = 0; i < 10; i++) {
      const run = await this.openai.beta.threads.runs.retrieve(threadId, runId);
      if (
        [
          "completed",
          "requires_action",
          "cancelled",
          "expired",
          "failed",
        ].includes(run.status)
      ) {
        return run;
      }

      this.logger.debug(
        `The status is not completed yet (${run.status}). Will wait for ${
          sleepTime / 1000
        } secs...`
      );
      await sleep(sleepTime);
      sleepTime *= 2;
    }
    console.log("Timeout");
    return null;
  }
}
