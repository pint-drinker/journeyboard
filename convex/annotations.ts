import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMap = query({
  args: { mapId: v.id("processMaps") },
  handler: async (ctx, { mapId }) => {
    return await ctx.db.query("annotations")
      .filter((q) => q.eq(q.field("mapId"), mapId))
      .collect();
  },
});

export const listByStep = query({
  args: { processMapStepId: v.id("processMapSteps") },
  handler: async (ctx, { processMapStepId }) => {
    return await ctx.db.query("annotations")
      .filter((q) => q.eq(q.field("processMapStepId"), processMapStepId))
      .collect();
  },
});

export const createMany = mutation({
  args: {
    annotations: v.array(
      v.object({
        content: v.string(),
        mapId: v.id("processMaps"),
        insightId: v.id("insights"), 
        processMapStepId: v.id("processMapSteps"),
        positiveSentiment: v.boolean()
      })
    )
  },
  handler: async (ctx, { annotations }) => {
    const insertedIds = [];
    for (const annotation of annotations) {
      const id = await ctx.db.insert("annotations", {
        content: annotation.content,
        mapId: annotation.mapId,
        insightId: annotation.insightId,
        processMapStepId: annotation.processMapStepId,
        positiveSentiment: annotation.positiveSentiment
      });
      insertedIds.push(id);
    }
    return insertedIds;
  }
});

export const deleteByMap = mutation({
  args: { mapId: v.id("processMaps") },
  handler: async (ctx, { mapId }) => {
    const annotations = await ctx.db.query("annotations")
      .filter((q) => q.eq(q.field("mapId"), mapId))
      .collect();
    
    for (const annotation of annotations) {
      await ctx.db.delete(annotation._id);
    }
    
    return annotations.length;
  }
});

