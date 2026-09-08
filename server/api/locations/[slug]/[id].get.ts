import z from "zod";
import { findLocation } from "~~/server/utils/db/queries/location";
import { findLocationLog } from "~~/server/utils/db/queries/location-log";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);
  if (!location) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location not found",
    });
  }

  const id = getRouterParam(event, "id") as string;

  if (!z.coerce.number().safeParse(id).success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid id",
    });
  }

  const locationLog = await findLocationLog(Number(id), event.context.user.id);
  if (!locationLog) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location log not found",
    });
  }

  return locationLog;
});
