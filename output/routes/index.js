"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorHandler = asyncErrorHandler;
const express_1 = require("express");
const branch_1 = __importDefault(require("./branch"));
const food_1 = __importDefault(require("./food"));
const authenticate_1 = __importDefault(require("./authenticate"));
const checkAccessType_1 = require("../middleware/checkAccessType");
function asyncErrorHandler(fn
// fn: ((req: Request, res: Response, next: NextFunction) => Promise<void> | ((req: Request, res: Response) => Promise<void>))
) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (err) {
            if (err instanceof Error) {
                // debug(`error occured: ${err.message}`);
                return res.status(400).json({
                    error: 0,
                    message: err.message
                });
            }
            else {
                res.json({
                    error: "Unknown Error!"
                });
            }
        }
    };
}
const router = (0, express_1.Router)();
const routes = [
    branch_1.default,
    food_1.default,
    authenticate_1.default,
];
for (const route of routes)
    for (const routeElement of route)
        router[routeElement.method](routeElement.path, (0, checkAccessType_1.checkAccessType)(routeElement.accessType), asyncErrorHandler(routeElement.handler));
exports.default = router;
