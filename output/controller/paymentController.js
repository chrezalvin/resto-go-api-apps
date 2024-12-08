"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
const Midtrans_1 = require("../services/Midtrans");
const createTransaction = async (req, res) => {
    const { orderId, grossAmount, customerDetails } = req.body;
    try {
        const transaction = await (0, Midtrans_1.createTransaction)(orderId, grossAmount, customerDetails);
        console.log("Transaksi berhasil dibuat:", transaction);
        res.status(200).json(transaction);
    }
    catch (error) {
        console.error("Error creating transaction:", error.message);
        res.status(500).json({ error: "Failed to create transaction", message: error.message });
    }
};
exports.createTransaction = createTransaction;
