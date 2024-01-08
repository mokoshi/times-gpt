import "reflect-metadata";
import { container } from "tsyringe";
import { OpenAIClient } from "./ai/openai-client";
import { Logger } from "./logger";
import { SqliteBotContextRepository } from "./ai/bot-context-repository/sqlite-bot-context-repository";
import { TogglTrackClient } from "./toggl-track/toggl-track";
import { MfKintaiClient } from "./mf-kintai/mf-kintai";
import { FunctionHandler } from "./function-handler/function-handler";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

type Container = {
  Logger: Logger;
  Database: BaseSQLiteDatabase<any, any>;
  BotContextRepository: SqliteBotContextRepository;
  OpenAIClient: OpenAIClient;
  MfKintaiClient: MfKintaiClient;
  TogglTrackClient: TogglTrackClient;
  FunctionHandler: FunctionHandler;
};

export function registerWithEnv(env: Record<string, any>) {
  register({
    logger: {
      logLevel: env.LOG_LEVEL as any,
    },
    database: {
      drizzle: env.DRIZZLE,
    },
    openAIClient: {
      apiKey: env.OPENAI_API_KEY,
    },
    mfKintaiClient: {
      sessionId: env.MF_KINTAI_SESSION_ID,
    },
    togglTrackClient: {
      apiToken: env.TOGGL_TRACK_API_TOKEN,
      workspaceId: parseInt(env.TOGGL_TRACK_WORKSPACE_ID),
    },
  });
}

export function register(config: {
  logger: { logLevel: "debug" | "info" | "warn" | "error" };
  database: { drizzle: BaseSQLiteDatabase<any, any> };
  openAIClient: { apiKey: string };
  mfKintaiClient: { sessionId: string };
  togglTrackClient: { apiToken: string; workspaceId: number };
}) {
  container.register("Logger", {
    useValue: new Logger(config.logger),
  });
  container.register("Database", {
    useValue: config.database.drizzle,
  });
  container.register("BotContextRepository", {
    useValue: new SqliteBotContextRepository(),
  });
  container.register("OpenAIClient", {
    useValue: new OpenAIClient(config.openAIClient.apiKey),
  });
  container.register("MfKintaiClient", {
    useValue: new MfKintaiClient(config.mfKintaiClient.sessionId),
  });
  container.register("TogglTrackClient", {
    useValue: new TogglTrackClient(
      config.togglTrackClient.apiToken,
      config.togglTrackClient.workspaceId
    ),
  });
  container.register("FunctionHandler", {
    useValue: new FunctionHandler(),
  });
}

export function resolve<Name extends keyof Container>(
  name: Name
): Container[Name] {
  return container.resolve(name);
}
