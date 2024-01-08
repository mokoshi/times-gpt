import "./di";
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { SlackApp } from "slack-cloudflare-workers";
import { botContext } from "./schema";
import { registerWithEnv } from "./di";
import { Mokonyan } from "./ai/mokonyan";

type Bindings = {
  DB: D1Database;
};
type Variables = {
  SLACK_SIGNING_SECRET: string;
  MOKOSHI_SLACK_ID: string;
};

const app = new Hono<{ Bindings: Bindings & Variables }>();

function trimHeadMention(text: string) {
  return text.replace(/^<@.*?>/, "").trim();
}

app.get("/", async (c) => {
  registerWithEnv({ ...c.env, Drizzle: drizzle(c.env.DB) });

  const db = drizzle(c.env.DB);
  const result = await db.select().from(botContext).all();
  return c.json(result);
});

app.post("/", async (c) => {
  registerWithEnv({ ...c.env, Drizzle: drizzle(c.env.DB) });

  const app = new SlackApp({ env: c.env });

  function isMokoshi(userId: string | undefined) {
    return userId === c.env.MOKOSHI_SLACK_ID;
  }

  app.event("app_mention", async ({ context, payload }) => {
    if (!isMokoshi(context.userId)) {
      await context.say({
        thread_ts: payload.thread_ts ?? payload.ts,
        text: "ごめんなさいにゃん。ぼくはもこしさんとしか話せないにゃん。",
      });
      return;
    }

    const mokonyan = new Mokonyan();
    await mokonyan.bootstrap();
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

export default app;
