"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentController_1 = require("../controller/paymentController");
const payment_1 = require("../middleware/payment");
const paymentRoutes = [
    {
        method: "post",
        path: "/api/payments/create",
        accessType: "public",
        handler: [payment_1.validatePaymentInput, paymentController_1.createTransaction],
    },
    {
        method: "post",
        path: "/api/payments/webhook",
        accessType: "public",
        handler: [paymentController_1.handleWebhook],
    },
];
exports.default = paymentRoutes;
