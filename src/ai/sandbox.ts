import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { registerWithEnv } from "../di";
import { readInput } from "../util/read-input";
import { Mokonyan } from "./mokonyan";
import fs from "fs";

const d1local = "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject";
const sqliteFile = fs
  .readdirSync(d1local)
  .find((file) => file.endsWith(".sqlite"));
registerWithEnv({
  ...process.env,
  Drizzle: drizzle(new Database(`${d1local}/${sqliteFile}`)),
});

async function sandbox() {
  const mokonyan = new Mokonyan();
  const assistantId = await mokonyan.prepareForAssistant(true);

  await mokonyan.startTalk(
    assistantId,
    "おはようございます。今日も一日頑張りましょう！"
  );
  await mokonyan.think();
  const messages = await mokonyan.getUnreadMessages();
  console.log(messages);

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
