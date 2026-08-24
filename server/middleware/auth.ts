import { auth } from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/dashboard")) {
    const session = await auth.api.getSession({ headers: event.headers });

    if (!session?.user) {
      sendRedirect(event, "/", 302);
    }
  }
});
