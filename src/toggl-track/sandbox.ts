import { sleep } from "../util";
import { TogglTrackClient } from "./toggl-track";

async function sandbox() {
  const client = new TogglTrackClient(
    process.env.TOGGL_TRACK_API_TOKEN!,
    Number(process.env.TOGGL_TRACK_WORKSPACE_ID!)
  );

  // console.log(await client.getProjects());
  // console.log(await client.getTags());
  // console.log(await client.getTimeEntries());
  console.log("Current:", await client.getCurrentTimeEntry());
  await sleep(1000);
  const e = await client.startTimeEntry("開発するよ");
  console.log("Start:", e);
  await sleep(1000);
  console.log("Current:", await client.getCurrentTimeEntry());
  await sleep(1000);
  console.log("Stopped!", await client.stopTimeEntry(e.id));
}

sandbox();
