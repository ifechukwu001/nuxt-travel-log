import type { InsertLocationLog } from "~~/server/utils/db/schema/location-log";
import { and, eq } from "drizzle-orm";

export async function findLocationLog(id: number, userId: number) {
  const foundLog = await db.query.locationLog.findFirst({
    where: {
      id,
      userId,
    },
  });

  return foundLog;
}

export async function insertLocationLog(locationId: number, insertable: InsertLocationLog, userId: number) {
  const [inserted] = await db.insert(locationLog).values({
    ...insertable,
    locationId,
    userId,
  }).returning();

  return inserted;
};

export async function updateLocationLog(locationLogId: number, updateable: InsertLocationLog, userId: number) {
  const [updated] = await db.update(locationLog).set({ ...updateable }).where(
    and(
      eq(locationLog.id, locationLogId),
      eq(locationLog.userId, userId),
    ),
  ).returning();

  return updated;
};
