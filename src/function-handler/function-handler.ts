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
    if (name === "kintai") {
      return await this.callMfKintai(params);
    } else {
      return "実行しました";
    }
  }

  async callMfKintai(data: FunctionParams["kintai"]) {
    this.logger.debug("callMfKintai", data);
    // await this.mfKintaiClient.recordTime(data.event);
    return "実行しました";
  }
}
