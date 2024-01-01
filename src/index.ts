import "./di";
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { SlackApp } from "slack-cloudflare-workers";
import { users } from "./schema";
import { OpenAIClient } from "./ai/openai-client";

type Bindings = {
  DB: D1Database;
};
type Variables = {
  SLACK_SIGNING_SECRET: string;
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings & Variables }>();

app.post("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();

  const app = new SlackApp({ env: c.env });
  const secretary = new OpenAIClient(c.env.OPENAI_API_KEY);

  app.event("app_mention", async ({ context, payload }) => {
    const completion = await secretary.getReply(payload.text);
    console.log(completion);
    await context.say({
      text: `<@${context.userId}> さん、何かご用ですか？\n${JSON.stringify(
        completion
      )}`,
    });
  });

  return await app.run(c.req.raw, c.executionCtx);
});

export default app;
