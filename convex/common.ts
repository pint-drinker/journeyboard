import { getAuthUserId } from "@convex-dev/auth/server";

export const getActiveUserInfoWithAuth = async (ctx: any, shouldThrow = true) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    if (shouldThrow) {
      throw new Error("Unauthenticated");
    }
    return { userId: null, groupId: null, memberId: null };
  }
  const activeGroupMember = await ctx.db.query("groupMembers").filter((q) => q.eq(q.field("userId"), userId)).first();
  if (!activeGroupMember) {
    if (shouldThrow) {
      throw new Error("User is not a member of any active group");
    }
    return { userId, groupId: null, memberId: null };
  }

  return { 
    userId,
    groupId: activeGroupMember.groupId, 
    memberId: activeGroupMember._id,
  };
};
