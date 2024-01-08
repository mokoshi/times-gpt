import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { registerWithEnv, resolve } from "../di";
import { readInput } from "../util/read-input";
import { Mokonyan } from "./mokonyan";
import fs from "fs";
import { BotSettingRepository } from "./bot-setting-repository";

const d1local = "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject";
const sqliteFile = fs
  .readdirSync(d1local)
  .find((file) => file.endsWith(".sqlite"));
registerWithEnv({
  ...process.env,
  DRIZZLE: drizzle(new Database(`${d1local}/${sqliteFile}`)),
});

async function sandbox() {
  const botSettingRepository = new BotSettingRepository();
  const assistantId = await botSettingRepository.fetchAssistantId();

  const mokonyan = new Mokonyan();

  const botContextRepository = resolve("BotContextRepository");
  const latest = await botContextRepository.fetchLatest();
  if (latest) {
    await botContextRepository.delete(latest.id);
  }

  await mokonyan.bootstrap(assistantId);

  while (true) {
    console.log("> ");
    const input = await readInput();
    await mokonyan.addMessage(input);
    await mokonyan.think();
    const messages = await mokonyan.getUnreadMessages();
    console.log(messages);
  }
}

sandbox();
