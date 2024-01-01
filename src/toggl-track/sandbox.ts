import { TogglTrackClient } from "./toggl-track";

async function sandbox() {
  const client = new TogglTrackClient(
    process.env.TOGGL_TRACK_API_TOKEN!,
    process.env.TOGGL_TRACK_WORKSPACE_ID!
  );

  // console.log(await client.getProjects());
  // console.log(await client.getTags());
  // console.log(await client.getTimeEntries());
  console.log(await client.getCurrentTimeEntry());
}

sandbox();
