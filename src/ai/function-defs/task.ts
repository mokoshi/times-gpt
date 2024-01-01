export const StartTaskFunc = {
  name: "record_start_task",
  description: "タスクを開始を記録します",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "タスクの名前",
      },
    },
  },
};

export const AddTaskMemoFunc = {
  name: "add_task_memo",
  description: "現在進行中のタスクにメモを追記します",
  parameters: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "メモの内容。マークダウン形式で記述。",
      },
    },
  },
};

export const EndTaskFunc = {
  name: "record_end_task",
  description: "現在進行中のタスクの終了を記録します",
  parameters: {
    type: "object",
    properties: {
      categories: {
        type: "array",
        description: "タスクのカテゴリ",
        items: { type: "string" },
        minItesm: 1,
        maxItems: 3,
      },
    },
  },
};

export const RecordTaskFunc = {
  name: "record_start_and_end_task",
  description: "実行したタスクを記録します",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "タスクの名前",
      },
      categories: {
        type: "array",
        description: "タスクのカテゴリ",
        items: { type: "string" },
        minItesm: 1,
        maxItems: 3,
      },
      duration: {
        type: "number",
        description: "タスクの実行時間(分)",
      },
    },
  },
};

export const NotifyTaskMemoAddedFunc = {
  name: "notify_task_memo_addition",
  description: "メモの追記が終わったことを知らせる",
  parameters: {},
};
