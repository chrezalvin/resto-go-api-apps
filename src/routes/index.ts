import { RouterInterface } from "libraries/CustomTypes";
import { NextFunction, RequestHandler, Router, Request, Response } from "express";

import branch from "./branch";
import food from "./food";
import authenticate from "./authenticate";
import paymentRoutes from "./paymentRoutes";
import { checkAccessType } from "middleware/checkAccessType";
import { validatePaymentInput } from "../middleware/payment";

export function asyncErrorHandler(fn: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({
          error: 0,
          message: err.message,
        });
      } else {
        res.status(500).json({
          error: "Unknown Error!",
        });
      }
    }
  };
}

const router: Router = Router();

const routes: RouterInterface[][] = [
  branch,
  food,
  authenticate,
  paymentRoutes,
];

for (const route of routes) {
  for (const routeElement of route) {
    const handlers = Array.isArray(routeElement.handler)
      ? routeElement.handler
      : [routeElement.handler];

    router[routeElement.method](
      routeElement.path,
      checkAccessType(routeElement.accessType),
      ...handlers.map(asyncErrorHandler)
    );
  }
}

export default router;