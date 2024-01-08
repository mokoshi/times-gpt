import { autoInjectable, inject } from "tsyringe";
import { MfKintaiClient } from "../mf-kintai/mf-kintai";
import { TogglTrackClient } from "../toggl-track/toggl-track";
import { Logger } from "../logger";
import { FunctionNameParamsUnion, FunctionParams } from "./function-defs";

@autoInjectable()
export class FunctionHandler {
  private mfKintaiClient: MfKintaiClient;
  private togglTrackClient: TogglTrackClient;
  private logger: Logger;

  constructor(
    @inject("MfKintaiClient") mfKintaiClient?: MfKintaiClient,
    @inject("TogglTrackClient") togglTrackClient?: TogglTrackClient,
    @inject("Logger") logger?: Logger
  ) {
    this.mfKintaiClient = mfKintaiClient!;
    this.togglTrackClient = togglTrackClient!;
    this.logger = logger!;
  }

  async callFunction({ name, params }: FunctionNameParamsUnion) {
    let result: { ok: boolean; data?: any; error?: string } = { ok: true };
    switch (name) {
      case "kintai":
        result.data = await this.callMfKintai(params);
        break;
      case "record_start_task":
        result.data = await this.recordStartTask(params);
        break;
      case "record_end_task":
        result.data = await this.recordEndTask(params);
        break;
      case "update_task":
        result.data = await this.updateTask(params);
        break;
      case "fetch_projects_and_tags":
        result.data = await this.fetchProjectsAndTags();
        break;
      default: {
        result.ok = false;
        result.error = `Unknown function name: ${name}`;
        break;
      }
    }
    return JSON.stringify(result);
  }

  async callMfKintai(data: FunctionParams["kintai"]) {
    this.logger.debug("callMfKintai", data);
    await this.mfKintaiClient.recordTime(data.event);
    return {};
  }

  async recordStartTask(data: FunctionParams["record_start_task"]) {
    this.logger.debug("call toggl startTimeEntry", data);
    const result = await this.togglTrackClient.startTimeEntry(data.description);
    return { id: result.id };
  }

  async recordEndTask(data: FunctionParams["record_end_task"]) {
    this.logger.debug("call toggl stopTimeEntry", data);
    const result = await this.togglTrackClient.stopTimeEntry(data.task_id);
    await this.togglTrackClient.updateTimeEntry(data.task_id, {
      description: data.description,
      project_id: data.project_id,
      tags: data.tags,
    });
    return { id: result.id };
  }

  async updateTask(data: FunctionParams["update_task"]) {
    this.logger.debug("call toggl updateTimeEntry", data);
    const result = await this.togglTrackClient.updateTimeEntry(data.task_id, {
      description: data.description,
      project_id: data.project_id,
      tags: data.tags,
    });
    return { id: result.id };
  }

  async fetchProjectsAndTags() {
    this.logger.debug("call toggl getProjects, getTags");
    const projects = await this.togglTrackClient.getProjects();
    const tags = await this.togglTrackClient.getTags();
    return {
      projects: projects.map((p) => ({ id: p.id, name: p.name })),
      tags: tags.map((t) => ({ id: t.id, name: t.name })),
    };
  }
}
