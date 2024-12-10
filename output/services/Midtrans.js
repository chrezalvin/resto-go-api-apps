"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL;
const midtransApi = axios_1.default.create({
    baseURL: MIDTRANS_BASE_URL,
    headers: {
        Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
    },
});
const createTransaction = async (orderId, grossAmount, customerDetails) => {
    const payload = {
        transaction_details: {
            order_id: orderId,
            gross_amount: grossAmount,
        },
        customer_details: customerDetails,
        payment_type: "qris",
    };
    try {
        const response = await midtransApi.post('/charge', payload);
        console.log("Transaksi berhasil, response:", response.data);
        const transactionId = response.data.transaction_id;
        const qrCodeUrl = `${MIDTRANS_BASE_URL}/qris/${transactionId}/qr-code`;
        return {
            transactionId,
            qrCodeUrl,
        };
    }
    catch (error) {
        console.error("Error dari Midtrans:", error.message);
        throw new Error(`Failed to create transaction with Midtrans: ${error.message}`);
    }
};
exports.createTransaction = createTransaction;
const handleWebhook = async (notification) => {
    try {
        console.log("Notifikasi webhook diterima:", notification);
        const { order_id, transaction_status, fraud_status } = notification;
        console.log(`Order ID: ${order_id}`);
        console.log(`Transaction Status: ${transaction_status}`);
        console.log(`Fraud Status: ${fraud_status}`);
        if (transaction_status === 'settlement') {
            console.log(`Transaksi ${order_id} berhasil.`);
            return { message: `Transaction ${order_id} is successful.` };
        }
        else if (transaction_status === 'pending') {
            console.log(`Transaksi ${order_id} dalam status pending.`);
            return { message: `Transaction ${order_id} is pending.` };
        }
        else if (transaction_status === 'deny' || fraud_status === 'challenge') {
            console.log(`Transaksi ${order_id} ditolak atau dalam challenge.`);
            return { message: `Transaction ${order_id} is denied or under challenge.` };
        }
        else if (transaction_status === 'expired') {
            console.log(`Transaksi ${order_id} kadaluarsa.`);
            return { message: `Transaction ${order_id} expired.` };
        }
        else if (transaction_status === 'cancel') {
            console.log(`Transaksi ${order_id} dibatalkan.`);
            return { message: `Transaction ${order_id} canceled.` };
        }
        else {
            console.error(`Transaksi ${order_id} gagal diproses.`);
            throw new Error(`Unknown transaction status: ${transaction_status}`);
        }
    }
    catch (error) {
        console.error("Error saat memproses webhook:", error);
        throw new Error(`Failed to handle webhook: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
exports.handleWebhook = handleWebhook;
