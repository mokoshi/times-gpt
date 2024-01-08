import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { type BotContextRepository } from "./bot-context-repository";
import { botContext } from "../../schema";
import { InferInsertModel, desc, eq } from "drizzle-orm";

export class SqliteBotContextRepository implements BotContextRepository {
  private db: BaseSQLiteDatabase<any, any>;

  constructor(drizzle: BaseSQLiteDatabase<any, any>) {
    this.db = drizzle;
  }

  async create(assistantId: string, threadId: string): Promise<number> {
    const result = await this.db
      .insert(botContext)
      .values([
        {
          assistantId,
          threadId,
          date: new Date().toISOString(),
        },
      ])
      .returning({ id: botContext.id });
    return result[0].id;
  }

  async fetch(id: number) {
    const results = await this.db
      .select()
      .from(botContext)
      .where(eq(botContext.id, id));

    if (results.length === 0) {
      throw new Error(`BotContext not found: ${id}`);
    }

    return results[0];
  }

  async fetchLatest() {
    const results = await this.db
      .select()
      .from(botContext)
      .orderBy(desc(botContext.date));

    if (results.length === 0) {
      return null;
    }

    return results[0];
  }

  async save(
    id: number,
    data: Partial<InferInsertModel<typeof botContext>>
  ): Promise<void> {
    await this.db.update(botContext).set(data).where(eq(botContext.id, id));
  }
}
