import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getActiveUserInfoWithAuth } from "./common";

export const list = query({
  handler: async (ctx) => {
    const { groupId } = await getActiveUserInfoWithAuth(ctx);

    return await ctx.db.query("processMaps")
      .filter((q) => q.eq(q.field("groupId"), groupId))
      .collect();
  },
});

export const get = query({
  args: { processMapId: v.id("processMaps") },
  handler: async (ctx, { processMapId }) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db.get(processMapId);
  },
});

export const getWithInsightCount = query({
  args: { processMapId: v.id("processMaps") },
  handler: async (ctx, { processMapId }) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthenticated call to mutation");
    }

    const processMap = await ctx.db.get(processMapId);
    if (!processMap) return null;
    
    const insightCount = await ctx.db
      .query("insights")
      .filter((q) => q.eq(q.field("mapId"), processMapId))
      .collect()
      .then(insights => insights.length);

    return {
      ...processMap,
      insightCount,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { name, description }) => {  
    const { groupId } = await getActiveUserInfoWithAuth(ctx);

    return await ctx.db.insert("processMaps", {
      name,
      description,
      groupId,
      nodes: {},
      insightIds: [],
      annotationIds: [],
    });
  }
});
