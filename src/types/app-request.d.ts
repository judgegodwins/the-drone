// import { Request } from "express";
// import * as core from "express-serve-static-core";
// import { Types } from "mongoose";
// import Route, { RouteDocument, RouteInput } from "../database/models/Route";
// import User from "../database/models/User";

// declare interface DecodedUserData
//   extends Pick<
//     User,
//     "_id" | "firstName" | "lastName" | "email" | "roles" | "region"
//   > {
//   routes?: Types.ObjectId[];
// }

// declare interface ProtectedRequest<
//   P = core.ParamsDictionary,
//   ResBody = any,
//   ReqBody = any,
//   ReqQuery = core.Query,
//   Locals extends Record<string, any> = Record<string, any>
// > extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
//   user: DecodedUserData;
// }

// declare type RequestWithRegToken = ProtectedRequest & {
//   registrationToken?: string;
// };

// declare interface CreateRouteRequest
//   extends ProtectedRequest<
//     core.ParamsDictionary,
//     any,
//     RouteInput,
//     core.Query,
//     Record<string, any>
//   > {}

// declare type ProtectedPinRequest = ProtectedRequest & {
//   opRoute: RouteDocument;
// };
// declare type PaginatedRequest = ProtectedRequest & { isPaginated: boolean };

// declare interface UpdateRouteRequest
//   extends ProtectedRequest<
//     core.ParamsDictionary,
//     any,
//     Partial<Omit<RouteInput, "pins">>,
//     core.Query,
//     Record<string, any>
//   > {}

// // declare interface UpdateConstrRouteRequest extends CreateRouteRequest<Partial<ConstructionRouteBody>> {}
// // declare interface UpdateNormalRouteRequest extends CreateRouteRequest<Partial<NormalRouteBody>> {}
