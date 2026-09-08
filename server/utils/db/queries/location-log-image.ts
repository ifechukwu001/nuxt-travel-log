import type { InsertLocationLogImage } from "~~/server/utils/db/schema";

export async function insertLocationLogImage(locationLogId: number, insertable: InsertLocationLogImage, userId: number) {
  const [inserted] = await db.insert(locationLogImage).values({
    ...insertable,
    locationLogId,
    userId,
  }).returning();

  return inserted;
}
