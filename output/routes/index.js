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
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const checkAccessType_1 = require("../middleware/checkAccessType");
function asyncErrorHandler(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({
                    error: 0,
                    message: err.message,
                });
            }
            else {
                res.status(500).json({
                    error: "Unknown Error!",
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
    paymentRoutes_1.default,
];
for (const route of routes) {
    for (const routeElement of route) {
        const handlers = Array.isArray(routeElement.handler)
            ? routeElement.handler
            : [routeElement.handler];
        router[routeElement.method](routeElement.path, (0, checkAccessType_1.checkAccessType)(routeElement.accessType), ...handlers.map(asyncErrorHandler));
    }
}
exports.default = router;
