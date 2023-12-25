import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { SlackApp, SlackEdgeAppEnv } from "slack-cloudflare-workers";
import { users } from "./schema";

type Bindings = {
  DB: D1Database;
};
type Variables = {
  SLACK_SIGNING_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings & Variables }>();

app.post("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();

  const app = new SlackApp({ env: c.env });
  app.event("app_mention", async ({ context }) => {
    await context.say({
      text: `<@${context.userId}> さん、何かご用ですか？`,
    });
  });

  return await app.run(c.req.raw, c.executionCtx);
});

export default app;
