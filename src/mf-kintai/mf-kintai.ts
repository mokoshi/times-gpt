export class MfKintaiClient {
  constructor(private readonly sessionId: string) {}

  async getAttendanceHistories(now: Date) {
    const res = await fetch(
      `https://attendance.moneyforward.com/api/external/web/attendance_histories?user_time=${now.toISOString()}`,
      { headers: { Cookie: this.getCookie() } }
    );
    return await res.json();
  }

  async recordTime(
    event: "clock_in" | "start_break" | "end_break" | "clock_out",
    now: Date = new Date()
  ) {
    {
      const res = await fetch(
        "https://attendance.moneyforward.com/api/external/web/time_recorders",
        {
          method: "POST",
          headers: {
            Cookie: this.getCookie(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event,
            user_time: now.toISOString(),
            office_location_id: 19676,
          }),
        }
      );
      return await res.json();
    }
  }

  private getCookie() {
    return `_session_id=${this.sessionId}`;
  }
}
