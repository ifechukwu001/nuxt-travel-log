import { findLocations } from "~~/server/utils/db/queries/location";

export default defineAuthenticatedEventHandler(async (event) => {
  return findLocations(event.context.user.id);
});
