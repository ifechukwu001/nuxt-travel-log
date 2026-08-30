import {
  index,
  integer,
  snakeCase,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const user = snakeCase.table("user", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer({ mode: "boolean" })
    .default(false)
    .notNull(),
  image: text(),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull(),
});

export const session = snakeCase.table(
  "session",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    expiresAt: integer().notNull(),
    token: text().notNull().unique(),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: integer()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  table => [index("session_userId_idx").on(table.userId)],
);

export const account = snakeCase.table(
  "account",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    issuer: text().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: integer()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: integer(),
    refreshTokenExpiresAt: integer(),
    scope: text(),
    password: text(),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull(),
  },
  table => [
    uniqueIndex("account_issuer_accountId_uidx").on(
      table.issuer,
      table.accountId,
    ),
    index("account_userId_idx").on(table.userId),
  ],
);

export const verification = snakeCase.table(
  "verification",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: integer().notNull(),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull(),
  },
  table => [index("verification_identifier_idx").on(table.identifier)],
);
