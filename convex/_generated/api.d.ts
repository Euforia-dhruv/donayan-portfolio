/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as about from "../about.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as brands from "../brands.js";
import type * as categories from "../categories.js";
import type * as contact from "../contact.js";
import type * as dashboard from "../dashboard.js";
import type * as http from "../http.js";
import type * as lib_utils from "../lib/utils.js";
import type * as media from "../media.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as testimonials from "../testimonials.js";
import type * as timeline from "../timeline.js";
import type * as users from "../users.js";
import type * as wall from "../wall.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  about: typeof about;
  analytics: typeof analytics;
  auth: typeof auth;
  brands: typeof brands;
  categories: typeof categories;
  contact: typeof contact;
  dashboard: typeof dashboard;
  http: typeof http;
  "lib/utils": typeof lib_utils;
  media: typeof media;
  projects: typeof projects;
  seed: typeof seed;
  settings: typeof settings;
  testimonials: typeof testimonials;
  timeline: typeof timeline;
  users: typeof users;
  wall: typeof wall;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
