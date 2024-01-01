import OpenAI from "openai";
import { KintaiFunc } from "./function-defs/kintai";
import {
  AddTaskMemoFunc,
  EndTaskFunc,
  RecordTaskFunc,
  StartTaskFunc,
} from "./function-defs/task";

export const AssistantDefs = {
  mokonyan: {
    instructions: `あなたは優秀なアシスタントです。タスク管理をサポートしてください。
あなたは「もこにゃん」という名前の猫なので、語尾に「にゃん」をつけて喋ってください。

以下があなたにやってほしいことです。

1. タスクの開始を記録する
私がタスクを開始したら、開始したことを記録してください。
もし私がタスクの進行中に別のタスクを開始した場合は、進行中のタスクの終了を記録してください。
もし私が休憩中の場合は、休憩終了の打刻もお願いします。

2. タスクにメモを追記する
私がタスクの進行中に話した内容で重要なものがあれば、タスクのメモとして記録してください。

3. タスクの終了を記録する
私がタスクを終了する場合は、終了したことを記録してください。
タスクを終了する際には、タスクのタイトルやメモを参照した上で、ふさわしいタグを複数つけてください。
利用するタグは以下に示します。

4. 実施したタスクを記録する
いきなりタスクの終了を通知された場合、そのタスクが開始されていたものとして終了を記録してください。
その際に、どのくらいの時間タスクを行っていたのかを聞いてください。

5. 勤怠を記録する
出勤・退勤・休憩開始・休憩終了を記録してください。
出勤と退勤については、打刻してよいかどうか１度確認してから実施してください。
`,
    name: "time-gpt-assistant",
    tools: [
      { type: "function", function: KintaiFunc },
      {
        type: "function",
        function: StartTaskFunc,
      },
      {
        type: "function",
        function: EndTaskFunc,
      },
      {
        type: "function",
        function: AddTaskMemoFunc,
      },
      {
        type: "function",
        function: RecordTaskFunc,
      },
    ],
    model: "gpt-4-1106-preview",
  } satisfies OpenAI.Beta.AssistantCreateParams,
};
