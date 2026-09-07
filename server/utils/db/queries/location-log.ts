import type { InsertLocationLog } from "~~/server/utils/db/schema/location-log";

export async function insertLocationLog(locationId: number, insertable: InsertLocationLog, userId: number) {
  const [inserted] = await db.insert(locationLog).values({
    ...insertable,
    locationId,
    userId,
  }).returning();

  return inserted;
};
