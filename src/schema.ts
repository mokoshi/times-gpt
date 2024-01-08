import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const botContext = sqliteTable("bot_context", {
  id: integer("id").primaryKey().notNull(),
  date: text("date").notNull(),
  assistantId: text("assistant_id").notNull(),
  threadId: text("thread_id").notNull(),
  runId: text("run_id"),
  messageReadAt: integer("message_read_at").notNull().default(0),
});

export const botSetting = sqliteTable("bot_setting", {
  id: integer("id").primaryKey().notNull(),
  assistantId: text("assistant_id").notNull(),
});
