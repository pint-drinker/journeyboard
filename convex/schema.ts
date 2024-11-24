import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";


export default defineSchema({
  ...authTables,

  // TODO: Role-Based Permissions

  // Groups and Membership
  userGroups: defineTable({
    name: v.string(),
  }),

  groupMembers: defineTable({
    userId: v.id("users"),
    groupId: v.id("userGroups"),
    role: v.optional(v.string()),
    joinedAt: v.number(),
  }).index("by_group", ["groupId"])
    .index("by_user", ["userId"]),

  groupInvites: defineTable({
    email: v.string(),
    groupId: v.id("userGroups"),
    role: v.string(),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
    invitedBy: v.id("users"),
  }).index("by_email", ["email"]),

  // Mapping Tool
  processMaps: defineTable({
    groupId: v.id("userGroups"),
    name: v.string(),
    description: v.optional(v.string()),
    nodes: v.object({}), // JSON representation of nodes
    insightIds: v.array(v.id("insights")),
    annotationIds: v.array(v.id("annotations")),
  }),

  processMapSteps: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    mapId: v.id("processMaps"),
  }),

  // Customer Insights
  insights: defineTable({
    title: v.string(),
    content: v.optional(v.string()),
    groupId: v.id("userGroups"),
    mapId: v.id("processMaps"),
    ownerName: v.string(),
  }),

  annotations: defineTable({
    content: v.string(),
    mapId: v.id("processMaps"),
    insightId: v.id("insights"),
    processMapStepId: v.id("processMapSteps"),
    positiveSentiment: v.boolean(),
  }),

  // TODO: Organizations and External Users, associated to insights
  organizations: defineTable({
    name: v.string(),
  }),

  externalUsers: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.id("organizations"),
  }),
});

