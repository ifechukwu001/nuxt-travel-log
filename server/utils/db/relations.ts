import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, r => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  location: {
    locationLogs: r.many.locationLog(),
  },
  locationLog: {
    location: r.one.location({
      from: r.locationLog.id,
      to: r.location.id,
    }),
  },
}));
