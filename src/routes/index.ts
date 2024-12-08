import { RouterInterface } from "libraries/CustomTypes";
import { NextFunction, RequestHandler, Router, Request, Response } from "express";

import branch from "./branch";
import food from "./food";
import authenticate from "./authenticate";
import payment from "../middleware/payment";
import { checkAccessType } from "middleware/checkAccessType";

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
    payment, 
];


for (const route of routes) {
    for (const routeElement of route) {
        router[routeElement.method](
            routeElement.path,
            checkAccessType(routeElement.accessType),
            asyncErrorHandler(routeElement.handler)
        );
    }
}

export default router;
