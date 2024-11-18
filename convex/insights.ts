import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { groupId: v.id("userGroups") },
  handler: async (ctx, { groupId }) => {
    return await ctx.db.query("insights").filter((q) => q.eq(q.field("groupId"), groupId)).collect();
  },
});

export const listByMap = query({
  args: { mapId: v.id("processMaps") },
  handler: async (ctx, { mapId }) => {
    return await ctx.db.query("insights")
      .filter((q) => q.eq(q.field("mapId"), mapId))
      .collect();
  },
});

export const get = query({
  args: { insightId: v.id("insights") },
  handler: async (ctx, { insightId }) => {
    return await ctx.db.get(insightId);
  },
});

export const create = mutation({
  args: {
    mapId: v.id("processMaps"),
    ownerName: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
    groupId: v.id("userGroups")
  },
  handler: async (ctx, { mapId, ownerName, title, content, groupId }) => {
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
    return await ctx.db.patch(insightId, {
      mapId,
      ownerName, 
      title,
      content
    });
  }
});


