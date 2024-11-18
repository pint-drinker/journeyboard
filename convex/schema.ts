import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),

  // User and Authentication
  users: defineTable({
    email: v.string(),
    password: v.string(),
    name: v.string(),
    createdAt: v.number(), // Store as timestamp (e.g., Date.now())
    updatedAt: v.number(), // Store as timestamp
    roleId: v.optional(v.id("roles")),
    organizationIds: v.array(v.id("organizations")),
  }),

  // Role-Based Permissions
  roles: defineTable({
    name: v.string(),
    permissionIds: v.array(v.id("permissions")),
  }),

  permissions: defineTable({
    name: v.string(),
  }),

  // Groups and Membership
  userGroups: defineTable({
    name: v.string(),
    memberIds: v.array(v.id("groupMembers")),
  }),

  groupMembers: defineTable({
    userId: v.id("users"),
    groupId: v.id("userGroups"),
  }),

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

  // Organizations and External Users
  organizations: defineTable({
    name: v.string(),
    userIds: v.array(v.id("users")),
    externalUserIds: v.array(v.id("externalUsers")),
  }),

  externalUsers: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.id("organizations"),
  }),
});

