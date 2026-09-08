import type { InsertLocationLogImage } from "~~/server/utils/db/schema";
import { and, eq } from "drizzle-orm";

export async function insertLocationLogImage(locationLogId: number, insertable: InsertLocationLogImage, userId: number) {
  const [inserted] = await db.insert(locationLogImage).values({
    ...insertable,
    locationLogId,
    userId,
  }).returning();

  return inserted;
}

export async function deleteLocationLogImage(imageId: number, userId: number) {
  const [deleted] = await db.delete(locationLogImage).where(
    and(
      eq(locationLogImage.id, imageId),
      eq(locationLogImage.userId, userId),
    ),
  ).returning();

  return deleted;
}
