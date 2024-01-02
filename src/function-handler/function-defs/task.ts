export const TaskFuncDefs = {
  record_start_task: {
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
    required: ["title"],
  },
  add_task_memo: {
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
    required: ["content"],
  },
  record_end_task: {
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
    required: ["categories"],
  },
  record_start_and_end_task: {
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
    required: ["title", "categories", "duration"],
  },
} as const;
