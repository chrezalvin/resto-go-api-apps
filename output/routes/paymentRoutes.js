"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controller/paymentController");
const router = (0, express_1.Router)();
// Endpoint untuk membuat transaksi
router.post('/api/payments/create', paymentController_1.createTransaction);
// Endpoint untuk menangani webhook dari Midtrans
// router.post('/api/payments/webhook', handleWebhook);
exports.default = router;
