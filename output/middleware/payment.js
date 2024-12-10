"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePaymentInput = void 0;
const validatePaymentInput = (req, res, next) => {
    const { orderId, grossAmount, customerDetails } = req.body;
    if (!orderId || !grossAmount || !customerDetails) {
        return res.status(400).json({ error: "Missing required fields: orderId, grossAmount, or customerDetails" });
    }
    if (typeof grossAmount !== "number" || grossAmount <= 0) {
        return res.status(400).json({ error: "grossAmount must be a positive number" });
    }
    next();
};
exports.validatePaymentInput = validatePaymentInput;
