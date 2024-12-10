import { RouterInterface } from "libraries/CustomTypes";
import { NextFunction, RequestHandler, Router, Request, Response } from "express";

import branch from "./branch";
import food from "./food";
import authenticate from "./authenticate";
import paymentRoutes from "./paymentRoutes"; // Rute pembayaran
import { checkAccessType } from "middleware/checkAccessType";
import { validatePaymentInput } from "../middleware/payment"; // Middleware pembayaran

// Asynchronous Error Handler to Catch Errors in Routes
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

// Router Initialization
const router: Router = Router();

// Array of Routes and Route Handlers
const routes: RouterInterface[][] = [
  branch,         // Routes for branches
  food,           // Routes for food-related services
  authenticate,   // Routes for authentication
  paymentRoutes,  // Payment-related routes
];

// Apply Middleware and Routes
for (const route of routes) {
  for (const routeElement of route) {
    const handlers = Array.isArray(routeElement.handler)
      ? routeElement.handler
      : [routeElement.handler]; // Ensure handlers is always an array

    router[routeElement.method](
      routeElement.path,
      checkAccessType(routeElement.accessType),  // Middleware for access control
      ...handlers.map(asyncErrorHandler)        // Apply async error handling to all handlers
    );
  }
}

// Export the router to be used in the main application
export default router;
