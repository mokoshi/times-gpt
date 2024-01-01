import "reflect-metadata";
import { container } from "tsyringe";
import { OpenAIClient } from "./ai/openai-client";
import { Logger } from "./logger";
import { SqliteBotContextRepository } from "./ai/bot-context-repository/sqlite-bot-context-repository";
import { TogglTrackClient } from "./toggl-track/toggl-track";
import { MfKintaiClient } from "./mf-kintai/mf-kintai";
import { FunctionHandler } from "./function-handler/function-handler";

export function register(config: {
  logger: { logLevel: "debug" | "info" | "warn" | "error" };
}) {
  container.register("Logger", {
    useValue: new Logger(config.logger),
  });
  container.register("BotContextRepository", {
    useValue: new SqliteBotContextRepository(
      "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/0f56c07050f060c476de712cc860e9226ca8a7339f9034c52969e22811c96c3b.sqlite"
    ),
  });
  container.register("OpenAIClient", {
    useValue: new OpenAIClient(process.env.OPENAI_API_KEY!),
  });
  container.register("MfKintaiClient", {
    useValue: new MfKintaiClient(process.env.MF_SESSION_ID!),
  });
  container.register("TogglTrackClient", {
    useValue: new TogglTrackClient(
      process.env.TOGGL_TRACK_API_TOKEN!,
      process.env.TOGGL_TRACK_WORKSPACE_ID!
    ),
  });
  container.register("FunctionHandler", {
    useValue: new FunctionHandler(),
  });
}
