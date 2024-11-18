import { query, mutation, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const list = query({
  args: { groupId: v.id("userGroups") },
  handler: async (ctx, { groupId }) => {
    return await ctx.db.query("processMaps").filter((q) => q.eq(q.field("groupId"), groupId)).collect();
  },
});

export const get = query({
  args: { processMapId: v.id("processMaps") },
  handler: async (ctx, { processMapId }) => {
    return await ctx.db.get(processMapId);
  },
});

export const getWithInsightCount = query({
  args: { processMapId: v.id("processMaps") },
  handler: async (ctx, { processMapId }) => {
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

// TODO: figure out authentication
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    groupId: v.id("userGroups")
  },
  handler: async (ctx, { name, description, groupId }) => {  
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


export const ingestInsights = action({
  args: { processMapId: v.id("processMaps") },
  handler: async (ctx, { processMapId }) => {
    // First delete existing annotations
    await ctx.runMutation(
      internal.annotations.deleteByMap,
      { mapId: processMapId },
    );

    // Get all insights for this process map
    const insights = await ctx.runQuery(
      internal.insights.listByMap,
      { mapId: processMapId },
    );

    // Get process map steps to associate annotations with
    const steps = await ctx.runQuery(
      internal.processMapSteps.listByMap,
      { mapId: processMapId },
    );

    const annotations: {
      content: string;
      mapId: Id<"processMaps">;
      insightId: Id<"insights">;
      processMapStepId: Id<"processMapSteps">;
      positiveSentiment: boolean;
    }[] = [];
    
    // Process each insight
    for (const insight of insights) {
      // TODO: Replace with actual API endpoint
      const response = await fetch("https://api.example.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          insightContent: insight.content,
          steps: steps.map(s => ({ id: s._id, name: s.name }))
        })
      });

      const analysisResults = await response.json();
      
      // Expected format of analysisResults:
      // [{ content: string, stepId: Id<"processMapSteps">, sentiment: boolean }]
      
      analysisResults.forEach(result => {
        annotations.push({
          content: result.content,
          mapId: processMapId,
          insightId: insight._id,
          processMapStepId: result.stepId,
          positiveSentiment: result.sentiment
        });
      });
    }

    // Create all annotations
    return await ctx.runMutation(internal.annotations.createMany, { annotations });
  }
});
