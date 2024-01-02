export const KintaiFuncDefs = {
  kintai: {
    name: "kintai",
    description:
      "勤怠管理を行います。出勤(clock_in)、退勤(clock_out)、休憩開始(start_break)、休憩終了(end_break)をそれぞれ打刻します。",
    parameters: {
      type: "object",
      properties: {
        event: {
          type: "string",
          enum: ["clock_in", "clock_out", "start_break", "end_break"],
          description:
            "出勤(clock_in)、退勤(clock_out)、休憩開始(start_break)、休憩終了(end_break)のいずれかを指定します。",
        },
      },
      required: ["event"],
    },
  },
} as const;
