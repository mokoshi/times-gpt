import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { botContext } from "../../schema";

type BotContextSelect = InferSelectModel<typeof botContext>;

export interface BotContextRepository {
  // とりあえずスレッドはアシスタントを固定で作ってる。本当はRunごとにアシスタントを変更可能
  create(assistantId: string, threadId: string): Promise<number>;
  fetch(id: number): Promise<BotContextSelect>;
  save(
    id: number,
    data: Partial<InferInsertModel<typeof botContext>>
  ): Promise<void>;
}
