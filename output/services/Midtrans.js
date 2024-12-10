"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSnapTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_BASE_URL = "https://app.sandbox.midtrans.com/snap/v1"; // Ganti dengan base URL production jika diperlukan.
const midtransApi = axios_1.default.create({
    baseURL: MIDTRANS_BASE_URL,
    headers: {
        Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
        "Content-Type": "application/json",
    },
});
const createSnapTransaction = async (orderId, grossAmount, customerDetails) => {
    const payload = {
        transaction_details: {
            order_id: orderId,
            gross_amount: grossAmount,
        },
        customer_details: customerDetails,
    };
    try {
        const response = await midtransApi.post("/transactions", payload);
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.status_message || "Failed to create Snap transaction");
    }
};
exports.createSnapTransaction = createSnapTransaction;
