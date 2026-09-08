import z from "zod";
import { findLocation } from "~~/server/utils/db/queries/location";
import { deleteLocationLog } from "~~/server/utils/db/queries/location-log";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);
  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location not found",
    }));
  }

  const id = getRouterParam(event, "id") as string;

  if (!z.coerce.number().safeParse(id).success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Invalid id",
    }));
  }

  const deletedLog = await deleteLocationLog(Number(id), event.context.user.id);
  if (!deletedLog) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location log not found",
    }));
  }

  setResponseStatus(event, 204);
});
