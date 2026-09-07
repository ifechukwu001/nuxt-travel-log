export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);

  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location not found",
    }));
  }

  const result = await readValidatedBody(event, InsertLocationLog.safeParse);

  if (!result.success)
    return sendZodError(event, result.error);

  return insertLocationLog(location.id, result.data, event.context.user.id);
});
