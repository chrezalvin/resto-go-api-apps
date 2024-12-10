"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
const Midtrans_1 = require("../services/Midtrans");
const createTransaction = async (req, res) => {
    const { orderId, grossAmount, customerDetails } = req.body;
    try {
        const transaction = await (0, Midtrans_1.createSnapTransaction)(orderId, grossAmount, customerDetails);
        res.status(200).json({
            message: "Transaction created successfully",
            transaction,
        });
    }
    catch (error) {
        console.error("Error creating transaction:", error.message);
        res.status(500).json({
            error: "Failed to create transaction",
            message: error.message,
        });
    }
};
exports.createTransaction = createTransaction;
