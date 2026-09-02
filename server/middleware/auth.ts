import type { UserWithId } from "#server/utils/auth";
import { auth } from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });

  event.context.user = session?.user as unknown as UserWithId;

  if (event.path.startsWith("/dashboard")) {
    if (!session?.user) {
      sendRedirect(event, "/", 302);
    }
  }
});
