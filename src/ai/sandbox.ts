import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { register } from "../di";
import { readInput } from "../util/read-input";
import { Mokonyan } from "./mokonyan";

register({
  logger: { logLevel: "debug" },
  botContextRepository: {
    drizzle: drizzle(
      new Database(
        "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/0f56c07050f060c476de712cc860e9226ca8a7339f9034c52969e22811c96c3b.sqlite"
      )
    ),
  },
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
