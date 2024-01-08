import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { botSetting } from "../schema";
import { eq } from "drizzle-orm";
import { autoInjectable, inject } from "tsyringe";

@autoInjectable()
export class BotSettingRepository {
  private db: BaseSQLiteDatabase<any, any>;

  constructor(@inject("Database") db?: BaseSQLiteDatabase<any, any>) {
    this.db = db!;
  }

  async update(assistantId: string) {
    return await this.db
      .insert(botSetting)
      .values({ id: 1, assistantId })
      .onConflictDoUpdate({
        target: botSetting.id,
        set: { assistantId },
      });
  }

  async fetchAssistantId() {
    return (
      await this.db.select().from(botSetting).where(eq(botSetting.id, 1))
    )[0].assistantId;
  }
}
