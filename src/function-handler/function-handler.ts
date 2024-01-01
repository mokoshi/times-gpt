import { autoInjectable, inject } from "tsyringe";
import { MfKintaiClient } from "../mf-kintai/mf-kintai";
import { TogglTrackClient } from "../toggl-track/toggl-track";
import { Logger } from "../logger";

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

  async callFunction(name: string, args: string) {
    const parsedArgs = JSON.parse(args);
    if (name === "kintai") {
      return await this.callMfKintai(parsedArgs);
    } else {
      return "実行しました";
    }
  }

  async callMfKintai(data: {
    event: "clock_in" | "clock_out" | "start_break" | "end_break";
  }) {
    this.logger.debug("callMfKintai", data);
    await this.mfKintaiClient.recordTime(data.event);
    return "実行しました";
  }
}
