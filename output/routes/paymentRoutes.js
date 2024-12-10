"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentController_1 = require("../controller/paymentController");
const payment_1 = require("../middleware/payment");
const paymentRoutes = [
    {
        method: "post",
        path: "/api/payments/create",
        accessType: "public",
        handler: [payment_1.validatePaymentInput, paymentController_1.createTransaction], // Validasi input dan buat transaksi.
    },
];
exports.default = paymentRoutes;
