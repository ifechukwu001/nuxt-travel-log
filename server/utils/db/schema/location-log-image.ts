import type z from "zod";
import { integer, snakeCase, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-orm/zod";
import { user } from "./auth";
import { locationLog } from "./location-log";

export const locationLogImage = snakeCase.table("locationLogImage", {
  id: integer().primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  locationLogId: integer().notNull().references(() => locationLog.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer().notNull().$default(() => Date.now()),
  updatedAt: integer().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const InsertLocationLogImage = createInsertSchema(locationLogImage, {
  key: field => field.regex(/^\d+\/\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid key"),
}).omit({
  id: true,
  locationLogId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLocationLogImage = z.infer<typeof InsertLocationLogImage>;
export type SelectLocationLogImage = typeof locationLogImage.$inferSelect;
