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
const payment_1 = __importDefault(require("../middleware/payment")); // Tambahkan impor untuk modul payment
const checkAccessType_1 = require("../middleware/checkAccessType");
// Middleware untuk menangani error secara asinkron
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
// Inisialisasi Router
const router = (0, express_1.Router)();
// Daftar route yang tersedia
const routes = [
    branch_1.default,
    food_1.default,
    authenticate_1.default,
    payment_1.default, // Tambahkan modul payment ke daftar routes
];
// Iterasi untuk menambahkan semua route ke router
for (const route of routes) {
    for (const routeElement of route) {
        router[routeElement.method](routeElement.path, (0, checkAccessType_1.checkAccessType)(routeElement.accessType), asyncErrorHandler(routeElement.handler));
    }
}
exports.default = router;
