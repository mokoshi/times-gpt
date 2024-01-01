export class TogglTrackClient {
  constructor(
    private readonly apiToken: string,
    private readonly workspaceId: string
  ) {}

  private getWorkspacePath(workspaceId = this.workspaceId) {
    return `https://api.track.toggl.com/api/v9/workspaces/${workspaceId}`;
  }
  private getMePath() {
    return `https://api.track.toggl.com/api/v9/me`;
  }

  private async fetch(method: "GET" | "POST", url: string) {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${this.apiToken}:api_token`)}`,
      },
    });
    return await res.json();
  }

  async getProjects(workspaceId = this.workspaceId) {
    const res = await this.fetch(
      "GET",
      `${this.getWorkspacePath(workspaceId)}/projects`
    );
    return res as { id: number; name: string }[];
  }

  async getTags(workspaceId = this.workspaceId) {
    const res = await this.fetch(
      "GET",
      `${this.getWorkspacePath(workspaceId)}/tags`
    );
    return res as { id: number; name: string }[];
  }

  async getTimeEntries() {
    const res = await this.fetch("GET", `${this.getMePath()}/time_entries`);
    return res as { id: number; description: string }[];
  }

  async getCurrentTimeEntry() {
    const res = await this.fetch(
      "GET",
      `${this.getMePath()}/time_entries/current`
    );
    return res as { id: number; description: string }[];
  }
}
