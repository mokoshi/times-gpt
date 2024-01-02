import { FromSchema } from "json-schema-to-ts";
import { KintaiFuncDefs } from "./kintai";
import { TaskFuncDefs } from "./task";

export const FunctionDefs = {
  ...KintaiFuncDefs,
  ...TaskFuncDefs,
};
export type FunctionNames = keyof typeof FunctionDefs;

export type FunctionParams = {
  [KintaiFuncDefs.kintai.name]: FromSchema<
    typeof KintaiFuncDefs.kintai.parameters
  >;
  [TaskFuncDefs.record_start_task.name]: FromSchema<
    typeof TaskFuncDefs.record_start_task.parameters
  >;
  [TaskFuncDefs.record_start_and_end_task.name]: FromSchema<
    typeof TaskFuncDefs.record_start_and_end_task.parameters
  >;
  [TaskFuncDefs.record_end_task.name]: FromSchema<
    typeof TaskFuncDefs.record_end_task.parameters
  >;
  [TaskFuncDefs.add_task_memo.name]: FromSchema<
    typeof TaskFuncDefs.add_task_memo.parameters
  >;
};
export type FunctionNameParamsUnion =
  | {
      name: "kintai";
      params: FromSchema<typeof KintaiFuncDefs.kintai.parameters>;
    }
  | {
      name: "record_start_task";
      params: FromSchema<typeof TaskFuncDefs.record_start_task.parameters>;
    }
  | {
      name: "record_start_and_end_task";
      params: FromSchema<
        typeof TaskFuncDefs.record_start_and_end_task.parameters
      >;
    }
  | {
      name: "record_end_task";
      params: FromSchema<typeof TaskFuncDefs.record_end_task.parameters>;
    }
  | {
      name: "add_task_memo";
      params: FromSchema<typeof TaskFuncDefs.add_task_memo.parameters>;
    };
