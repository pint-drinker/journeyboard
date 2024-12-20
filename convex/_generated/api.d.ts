/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as annotations from "../annotations.js";
import type * as auth from "../auth.js";
import type * as common from "../common.js";
import type * as http from "../http.js";
import type * as insights from "../insights.js";
import type * as openai from "../openai.js";
import type * as processMapSteps from "../processMapSteps.js";
import type * as processMaps from "../processMaps.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  annotations: typeof annotations;
  auth: typeof auth;
  common: typeof common;
  http: typeof http;
  insights: typeof insights;
  openai: typeof openai;
  processMapSteps: typeof processMapSteps;
  processMaps: typeof processMaps;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
