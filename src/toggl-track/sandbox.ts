import { sleep } from "../util/sleep";
import { TogglTrackClient } from "./toggl-track";

async function sandbox() {
  const client = new TogglTrackClient(
    process.env.TOGGL_TRACK_API_TOKEN!,
    Number(process.env.TOGGL_TRACK_WORKSPACE_ID!)
  );

  const projects = await client.getProjects();
  const tags = await client.getTags();

  // console.log(await client.getTimeEntries());
  console.log("Current:", await client.getCurrentTimeEntry());
  await sleep(1000);
  const e = await client.startTimeEntry("開発するよ");
  console.log("Start:", e);
  await sleep(1000);
  console.log("Current:", await client.getCurrentTimeEntry());
  await sleep(1000);
  console.log("Stopped!", await client.stopTimeEntry(e.id));
  console.log(projects[0]);
  console.log(
    "Stopped!",
    await client.updateTimeEntry(e.id, {
      description: "Edited:開発するよ",
      project_id: projects[0].id,
      tags: [tags[0].name, tags[1].name],
    })
  );
}

sandbox();
