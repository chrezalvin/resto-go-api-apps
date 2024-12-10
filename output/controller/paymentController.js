"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createTransaction = void 0;
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
const handleWebhook = async (req, res) => {
    const notificationData = req.body;
    try {
        const status = notificationData.transaction_status;
        const orderId = notificationData.order_id;
        console.log(`Transaction status for order ${orderId}: ${status}`);
        if (status === 'capture' || status === 'settlement') {
            res.redirect(`myapp://payment-success/${orderId}`);
        }
        else if (status === 'pending') {
            res.redirect('https://yourdomain.com/payment/pending');
        }
        else if (status === 'failed') {
            res.redirect('https://yourdomain.com/payment/failed');
        }
        else {
            res.status(400).json({ message: 'Unknown transaction status' });
        }
    }
    catch (error) {
        console.error("Error handling webhook:", error);
        res.status(500).json({ message: "Error processing payment status" });
    }
};
exports.handleWebhook = handleWebhook;
