import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;
const MIDTRANS_SECRET_KEY = process.env.MIDTRANS_SERVER_KEY!;
console.log("MIDTRANS_SERVER_KEY:", MIDTRANS_SERVER_KEY);

const MIDTRANS_BASE_URL = "https://app.sandbox.midtrans.com/snap/v1";
console.log("MIDTRANS_BASE_URL:", MIDTRANS_BASE_URL);

const midtransApi = axios.create({
  baseURL: MIDTRANS_BASE_URL,
  headers: {
    Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
    "Content-Type": "application/json",
  },
});

export const createSnapTransaction = async (orderId: string, grossAmount: number, customerDetails: any) => {
  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    customer_details: customerDetails,
    finish_url: "https://yourdomain.com/success",
  };

  console.log("Creating Snap transaction with payload:", payload);

  try {
    const response = await midtransApi.post("/transactions", payload);
    console.log("Response from Midtrans API:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("Error response from Midtrans API:", error.response?.data);
    throw new Error(error.response?.data?.status_message || "Failed to create Snap transaction");
  }
};

const verifySignature = (notification: any) => {
  const { signature_key, order_id, status_code, gross_amount } = notification;
  const payload = `${order_id}${status_code}${gross_amount}${MIDTRANS_SECRET_KEY}`;

  const hash = crypto.createHash("sha512").update(payload).digest("hex");

  return hash === signature_key;
};

export const handleWebhook = async (notification: any) => {
  try {
    const { order_id, transaction_status, fraud_status } = notification;

    switch (transaction_status) {
      case "settlement":
        console.log(`Transaksi ${order_id} berhasil.`);
        return { message: `Transaction ${order_id} is successful.` };
      case "pending":
        console.log(`Transaksi ${order_id} dalam status pending.`);
        return { message: `Transaction ${order_id} is pending.` };
      case "deny":
      case "cancel":
        console.log(`Transaksi ${order_id} gagal.`);
        return { message: `Transaction ${order_id} is failed.` };
      case "expired":
        console.log(`Transaksi ${order_id} kadaluarsa.`);
        return { message: `Transaction ${order_id} expired.` };
      case "challenge":
        console.log(`Transaksi ${order_id} sedang dalam challenge.`);
        return { message: `Transaction ${order_id} is under challenge.` };
      default:
        throw new Error(`Unknown transaction status: ${transaction_status}`);
    }
  } catch (error) {
    console.error("Error saat memproses webhook:", error);
    throw new Error(`Failed to handle webhook: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};