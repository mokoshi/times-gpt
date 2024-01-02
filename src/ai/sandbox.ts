import { register } from "../di";
import { readInput } from "../util";
import { Mokonyan } from "./mokonyan";

register({
  logger: { logLevel: "debug" },
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
