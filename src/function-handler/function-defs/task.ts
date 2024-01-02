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
      required: ["title"],
    },
  },
  record_end_task: {
    name: "record_end_task",
    description: "現在進行中のタスクの終了を記録します",
    parameters: {
      type: "object",
      properties: {
        task_id: {
          type: "number",
          description: "タスクのID",
        },
        project: {
          type: "string",
          description: "タスクのプロジェクト",
        },
        tags: {
          type: "array",
          description: "タスクのタグ",
          items: {
            type: "string",
          },
        },
      },
      required: ["task_id", "project", "tags"],
    },
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
        project: {
          type: "string",
          description: "タスクのプロジェクト",
        },
        tags: {
          type: "array",
          description: "タスクのタグ",
          items: {
            type: "string",
          },
        },
        duration: {
          type: "number",
          description: "タスクの実行時間(分)",
        },
      },
      required: ["title", "project", "tags", "duration"],
    },
  },
  fetch_projects_and_tags: {
    name: "fetch_projects_and_tags",
    description: "タスクに設定するプロジェクト・タグの一覧を取得します",
    parameters: {},
  },
} as const;
