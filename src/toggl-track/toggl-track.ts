export type TimeEntry = {
  id: number;
  description: string | null;
  start: string;
  stop: string;
  tag_ids: number[];
  tags: string[];
};

export class TogglTrackClient {
  constructor(
    private readonly apiToken: string,
    private readonly workspaceId: number
  ) {}

  private getWorkspacePath(workspaceId = this.workspaceId) {
    return `https://api.track.toggl.com/api/v9/workspaces/${workspaceId}`;
  }
  private getMePath() {
    return `https://api.track.toggl.com/api/v9/me`;
  }

  private async fetch(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    body?: Record<string, string | number>
  ) {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${this.apiToken}:api_token`)}`,
      },
      ...(body ? { body: JSON.stringify(body) } : undefined),
    });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(
        `Failed to call api: [${method}] ${url} (${res.status}, ${res.statusText}).\n${result}`
      );
    }
    return (await res.json()) as any;
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
    return res as { id: number; description: string } | null;
  }

  async startTimeEntry(title: string): Promise<TimeEntry> {
    const res = await this.fetch(
      "POST",
      `${this.getWorkspacePath()}/time_entries`,
      {
        created_with: "times gpt",
        description: title,
        start: new Date().toISOString(),
        duration: -1,
        workspace_id: this.workspaceId,
      }
    );
    return res;
  }

  async stopTimeEntry(id: number): Promise<TimeEntry> {
    const res = await this.fetch(
      "PATCH",
      `${this.getWorkspacePath()}/time_entries/${id}/stop`
    );
    return res;
  }

  async createTimeEntry(
    title: string,
    start: string,
    end: string
  ): Promise<TimeEntry> {
    const res = await this.fetch(
      "POST",
      `${this.getWorkspacePath()}/time_entries`,
      {
        created_with: "times gpt",
        description: title,
        start,
        end,
        workspace_id: this.workspaceId,
      }
    );
    return res;
  }
}
