import { RouterInterface } from "libraries/CustomTypes";
import { NextFunction, RequestHandler, Router, Request, Response } from "express";

import branch from "./branch";
import food from "./food";
import authenticate from "./authenticate";
import payment from "../middleware/payment";
import { checkAccessType } from "middleware/checkAccessType";

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
  payment,        // Payment-related routes
];

// Loop through routes and register each route with proper access type and error handling
for (const route of routes) {
  for (const routeElement of route) {
    router[routeElement.method](
      routeElement.path,
      checkAccessType(routeElement.accessType),  // Check if access is allowed based on accessType
      asyncErrorHandler(routeElement.handler)    // Apply async error handling
    );
  }
}

// Export the router to be used in the main application
export default router;
