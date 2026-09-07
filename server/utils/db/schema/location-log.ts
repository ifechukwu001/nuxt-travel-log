import type z from "zod";
import { integer, real, snakeCase, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-orm/zod";
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

export const InsertLocationLog = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit(
  {
    id: true,
    userId: true,
    locationId: true,
    createdAt: true,
    updatedAt: true,
  },
).superRefine((values, context) => {
  if (values.startedAt > values.endedAt || values.endedAt < values.startedAt) {
    context.addIssue({
      code: "custom",
      message: "Start date must be before End date",
      path: ["startedAt"],
    });
    context.addIssue({
      code: "custom",
      message: "End date must be after Start date",
      path: ["endedAt"],
    });
  }
});

export type InsertLocationLog = z.infer<typeof InsertLocationLog>;
export const InsertLocationLog = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit(
  {
    id: true,
    userId: true,
    locationId: true,
    createdAt: true,
    updatedAt: true,
  },
).superRefine((values, context) => {
  if (values.startedAt > values.endedAt || values.endedAt < values.startedAt) {
    context.addIssue({
      code: "custom",
      message: "Start date must be before End date",
      path: ["startedAt"],
    });
    context.addIssue({
      code: "custom",
      message: "End date must be after Start date",
      path: ["endedAt"],
    });
  }
});

export type InsertLocationLog = z.infer<typeof InsertLocationLog>;
export type SelectLocationLog = typeof locationLog.$inferSelect;
