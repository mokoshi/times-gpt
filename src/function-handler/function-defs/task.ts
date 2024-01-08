const description = {
  type: "string",
  description:
    "タスクの名前。例えば:「ServiceLocatorを実装する」「面談の準備をする」",
} as const;

export const TaskFuncDefs = {
  record_start_task: {
    name: "record_start_task",
    description: "タスクを開始を記録します",
    parameters: {
      type: "object",
      properties: {
        description,
      },
      required: ["description"],
    },
  },
  record_end_task: {
    name: "record_end_task",
    description: "現在進行中のタスクの終了を記録します",
    parameters: {
      type: "object",
      properties: {
        description,
        task_id: {
          type: "number",
          description: "タスクのID",
        },
        project_id: {
          type: "number",
          description: "プロジェクトのID",
        },
        tags: {
          type: "array",
          description: "タスクのタグ",
          items: {
            type: "string",
          },
        },
      },
      required: ["task_id"],
    },
  },
  update_task: {
    name: "update_task",
    description: "タスクの内容を編集します",
    parameters: {
      type: "object",
      properties: {
        description,
        task_id: {
          type: "number",
          description: "タスクのID",
        },
        project_id: {
          type: "number",
          description: "プロジェクトのID",
        },
        tags: {
          type: "array",
          description: "タスクのタグ",
          items: {
            type: "string",
          },
        },
      },
      required: ["task_id"],
    },
  },
  record_start_and_end_task: {
    name: "record_start_and_end_task",
    description: "実行したタスクを記録します",
    parameters: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description:
            "タスクの名前。例えば：「ServiceLocatorを実装する」「面談の準備をする」",
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
