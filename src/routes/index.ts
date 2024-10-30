import { RouterInterface } from "libraries/CustomTypes";
import { NextFunction, RequestHandler, Router, Request, Response } from "express";

import branch from "./branch";
import food from "./food";

export function asyncErrorHandler(
    fn: RequestHandler
    // fn: ((req: Request, res: Response, next: NextFunction) => Promise<void> | ((req: Request, res: Response) => Promise<void>))
    ) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await fn(req, res, next);
            } catch (err) {
                if(err instanceof Error){
                    // debug(`error occured: ${err.message}`);
                    return res.status(400).json({
                        error: 0,
                        message: err.message
                    });
                }
                else{
                    res.json({
                        error: "Unknown Error!"
                    });
                }
            }
        }
    }

const router: Router = Router();

const routes: RouterInterface[][] = [
    branch,
    food,
];

for(const route of routes)
    for(const routeElement of route)
        router[routeElement.method](
            routeElement.path,
            asyncErrorHandler(routeElement.handler)
        );

export default router;