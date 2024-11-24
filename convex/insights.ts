import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getActiveUserInfoWithAuth } from "./common";

export const list = query({
  handler: async (ctx) => {
    const { groupId } = await getActiveUserInfoWithAuth(ctx);
    return await ctx.db.query("insights").filter((q) => q.eq(q.field("groupId"), groupId)).collect();
  },
});

export const listByMap = query({
  args: { mapId: v.id("processMaps") },
  handler: async (ctx, { mapId }) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db.query("insights")
      .filter((q) => q.eq(q.field("mapId"), mapId))
      .collect();
  },
});

export const get = query({
  args: { insightId: v.id("insights") },
  handler: async (ctx, { insightId }) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db.get(insightId);
  },
});

export const create = mutation({
  args: {
    mapId: v.id("processMaps"),
    ownerName: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { mapId, ownerName, title, content }) => {
    const { groupId } = await getActiveUserInfoWithAuth(ctx);

    return await ctx.db.insert("insights", {
      mapId,
      ownerName,
      title,
      content,
      groupId
    });
  }
});

export const edit = mutation({
  args: {
    insightId: v.id("insights"),
    mapId: v.id("processMaps"),
    ownerName: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { insightId, mapId, ownerName, title, content }) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db.patch(insightId, {
      mapId,
      ownerName, 
      title,
      content
    });
  }
});


