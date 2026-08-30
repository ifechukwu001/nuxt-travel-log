import type { DrizzleQueryError } from "drizzle-orm";

import { customAlphabet } from "nanoid";
import slugify from "slug";
import db from "~~/server/utils/db";
import { location } from "~~/server/utils/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result
      .error
      .issues
      .map(issue => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result
      .error
      .issues
      .reduce((errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingLocation = await db.query.location.findFirst({
    where: {
      name: result.data.name,
      userId: event.context.user.id,
    },
  });

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists.",
    }));
  }

  let slug = slugify(result.data.name);
  let existing = !!(await db.query.location.findFirst({
    where: {
      slug,
    },
  }));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;

    existing = !!(await db.query.location.findFirst({
      where: {
        slug: idSlug,
      },
    }));

    if (!existing) {
      slug = idSlug;
    }
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: event.context.user.id,
    }).returning();
    return created;
  }
  catch (e) {
    const error = e as DrizzleQueryError;
    if (error.cause?.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "Slug must be unique (the location name is used to generate the slug)",
      }));
    }
    throw error;
  }
});
