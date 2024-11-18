import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMap = query({
  args: { mapId: v.id("processMaps") },
  handler: async (ctx, { mapId }) => {
    return await ctx.db.query("processMapSteps")
      .filter((q) => q.eq(q.field("mapId"), mapId))
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    mapId: v.id("processMaps"),
    name: v.string(),
    description: v.optional(v.string())
  },
  handler: async (ctx, { mapId, name, description }) => {
    return await ctx.db.insert("processMapSteps", {
      mapId,
      name,
      description
    });
  }
});

// todo: deletion and reordering
