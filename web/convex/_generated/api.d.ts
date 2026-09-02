/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_chat from "../actions/chat.js";
import type * as actions_generateLecture from "../actions/generateLecture.js";
import type * as actions_generateQuiz from "../actions/generateQuiz.js";
import type * as actions_generateTimetable from "../actions/generateTimetable.js";
import type * as chat from "../chat.js";
import type * as fixtures_lecture from "../fixtures/lecture.js";
import type * as fixtures_timetable from "../fixtures/timetable.js";
import type * as lectures from "../lectures.js";
import type * as lib_claude from "../lib/claude.js";
import type * as quizzes from "../quizzes.js";
import type * as research from "../research.js";
import type * as sessions from "../sessions.js";
import type * as timetables from "../timetables.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/chat": typeof actions_chat;
  "actions/generateLecture": typeof actions_generateLecture;
  "actions/generateQuiz": typeof actions_generateQuiz;
  "actions/generateTimetable": typeof actions_generateTimetable;
  chat: typeof chat;
  "fixtures/lecture": typeof fixtures_lecture;
  "fixtures/timetable": typeof fixtures_timetable;
  lectures: typeof lectures;
  "lib/claude": typeof lib_claude;
  quizzes: typeof quizzes;
  research: typeof research;
  sessions: typeof sessions;
  timetables: typeof timetables;
  users: typeof users;
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
