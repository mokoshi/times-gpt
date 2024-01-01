import { register } from "../di";
import { readInput } from "../util";
import { Mokonyan } from "./mokonyan";

register({
  logger: { logLevel: "debug" },
});

async function main() {
  const mokonyan = new Mokonyan();
  await mokonyan.prepareForAssistant(true);

  await mokonyan.startTalk(
    "asst_cnIZ0N9HmF8laj9ZXd5V4b7C",
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

main();
