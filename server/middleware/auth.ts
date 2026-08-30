import { auth } from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });

  event.context.user = session?.user;

  if (event.path.startsWith("/dashboard")) {
    if (!session?.user) {
      sendRedirect(event, "/", 302);
    }
  }
});
