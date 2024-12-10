import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;
console.log("MIDTRANS_SERVER_KEY:", MIDTRANS_SERVER_KEY);

const MIDTRANS_BASE_URL = "https://app.sandbox.midtrans.com/snap/v1"; // Ganti dengan base URL production jika diperlukan.
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
