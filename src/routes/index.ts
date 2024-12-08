import { RouterInterface } from "libraries/CustomTypes";
import { NextFunction, RequestHandler, Router, Request, Response } from "express";

import branch from "./branch";
import food from "./food";
import authenticate from "./authenticate";
import payment from "./payment";
import transaction from "./transaction";
import { checkAccessType } from "middleware/checkAccessType";

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
    authenticate,
    payment,
];

for(const route of routes)
    for(const routeElement of route)
        router[routeElement.method](
            routeElement.path,
            checkAccessType(routeElement.accessType),
            asyncErrorHandler(routeElement.handler),
        );

export default router;