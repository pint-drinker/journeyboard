import GitHub from "@auth/core/providers/github";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth, getAuthUserId, getAuthSessionId } from "@convex-dev/auth/server";
import { query, MutationCtx } from "./_generated/server";
import { getActiveUserInfoWithAuth } from "./common";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx: MutationCtx, args) {
      const user = await ctx.db.get(args.userId);
      if (!user) return;

      // First check to see if a group member already exists for this user
      const groupMember = await ctx.db
        .query("groupMembers")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();

      if (groupMember) {
        // TODO: figure out multi-group ownership
        // delete all pending invites for this user
        const invitesToDelete = await ctx.db
          .query("groupInvites")
          .filter((q) => q.eq(q.field("email"), user.email))
          .collect();
        
        for (const invite of invitesToDelete) {
          await ctx.db.delete(invite._id);
        }
        return;
      }

      // Check for any pending invites for this user's email
      const pendingInvites = await ctx.db
        .query("groupInvites")
        .filter((q) => q.eq(q.field("email"), user.email))
        .collect();
  
      if (pendingInvites.length > 0) {
        // Add user to the first invited group
        const invite = pendingInvites[0];
        const groupMemberId = await ctx.db.insert("groupMembers", {
          userId: user._id,
          groupId: invite.groupId,
          role: invite.role,
          joinedAt: Date.now(),
        });
  
        // Update the group's memberIds array
        const group = await ctx.db.get(invite.groupId);
        await ctx.db.patch(invite.groupId, {
          memberIds: [...group.memberIds, groupMemberId],
        });
  
        // Clean up the invite
        await ctx.db.delete(invite._id);
      } else {
        // Create a new group with a fun random name
        const adjectives = ["Awesome", "Brilliant", "Creative", "Dynamic", "Energetic"];
        const nouns = ["Team", "Squad", "Crew", "Alliance", "League"];
        const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
          nouns[Math.floor(Math.random() * nouns.length)]
        }`;
  
        const groupId = await ctx.db.insert("userGroups", {
          name: randomName,
          memberIds: [],
        });
  
        await ctx.db.insert("groupMembers", {
          userId: user._id,
          groupId,
          role: "owner",
          joinedAt: Date.now(),
        });
      }
    },
  }
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const currentGroup = query({
  args: {},
  handler: async (ctx) => {
    const userInfo = await getActiveUserInfoWithAuth(ctx, false);
    if (userInfo.groupId === null) {
      return null;
    }
    return await ctx.db.get(userInfo.groupId);
  },
});

export const currentSession = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx);
    if (sessionId === null) {
      return null;
    }
    return await ctx.db.get(sessionId);
  },
});
