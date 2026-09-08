import { findLocation } from "~~/server/utils/db/queries/location";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);
  if (!location) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location not found",
    });
  }

  return location;
});
