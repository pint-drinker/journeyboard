import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
 
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub],
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const currentSession = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await auth.getSessionId(ctx);
    if (sessionId === null) {
      return null;
    }
    return await ctx.db.get(sessionId);
  },
});
