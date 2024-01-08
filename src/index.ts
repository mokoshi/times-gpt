import "./di";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { drizzle } from "drizzle-orm/d1";
import { SlackApp } from "slack-cloudflare-workers";
import { registerWithEnv, resolve } from "./di";
import { Mokonyan } from "./ai/mokonyan";
import { AssistantDefs } from "./ai/assistant-defs";
import { BotSettingRepository } from "./ai/bot-setting-repository";

type Bindings = {
  DB: D1Database;
};
type Variables = {
  SLACK_SIGNING_SECRET: string;
  MOKOSHI_SLACK_ID: string;
  TIMES_GPT_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings & Variables }>();

function trimHeadMention(text: string) {
  return text.replace(/^<@.*?>/, "").trim();
}

function registerWithHonoContext(c: any) {
  registerWithEnv({ ...c.env, DRIZZLE: drizzle(c.env.DB) });
}

app.get("/", async (c) => {
  registerWithHonoContext(c);
  return c.json({ ok: true });
});

app.post("/", async (c) => {
  registerWithHonoContext(c);

  const app = new SlackApp({ env: c.env });

  function isValidUser(userId: string | undefined) {
    return userId === c.env.MOKOSHI_SLACK_ID;
  }

  app.event("app_mention", async ({ context, payload }) => {
    if (!isValidUser(context.userId)) {
      await context.say({
        thread_ts: payload.thread_ts ?? payload.ts,
        text: "ごめんなさいにゃん。ぼくはもこしさんとしか話せないにゃん。",
      });
      return;
    }

    const botSettingRepository = new BotSettingRepository();
    const assistantId = await botSettingRepository.fetchAssistantId();

    const mokonyan = new Mokonyan();
    await mokonyan.bootstrap(assistantId);
    await mokonyan.addMessage(trimHeadMention(payload.text));
    await mokonyan.think();
    const messages = await mokonyan.getUnreadMessages({ role: "assistant" });
    for (const msg of messages) {
      await context.say({
        thread_ts: payload.thread_ts ?? payload.ts,
        text: msg.message,
      });
    }
  });

  return await app.run(c.req.raw, c.executionCtx);
});

app.post(
  "/renew_assistant",
  (c, ...args) => bearerAuth({ token: c.env.TIMES_GPT_API_KEY })(c, ...args),
  async (c) => {
    registerWithHonoContext(c);

    const openAI = resolve("OpenAIClient");
    const assistant = await openAI.createAssistant(AssistantDefs.mokonyan);
    const assistantId = assistant.id;

    const botSettingRepository = new BotSettingRepository();
    await botSettingRepository.update(assistantId);

    return c.json({ assistantId });
  }
);

export default app;
