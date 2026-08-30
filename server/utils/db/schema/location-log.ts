import { integer, real, snakeCase, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { location } from "./location";

export const locationLog = snakeCase.table("locationLog", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: integer().notNull(),
  endedAt: integer().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: integer().notNull().references(() => location.id),
  userId: integer().notNull().references(() => user.id),
  createdAt: integer().notNull().$default(() => Date.now()),
  updatedAt: integer().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
