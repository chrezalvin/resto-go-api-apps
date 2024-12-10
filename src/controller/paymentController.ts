import { Request, Response } from "express";
import { createSnapTransaction } from "../services/Midtrans";

export const createTransaction = async (req: Request, res: Response) => {
  const { orderId, grossAmount, customerDetails } = req.body;

  try {
    const transaction = await createSnapTransaction(orderId, grossAmount, customerDetails);
    res.status(200).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error: any) {
    console.error("Error creating transaction:", error.message);
    res.status(500).json({
      error: "Failed to create transaction",
      message: error.message,
    });
  }
};
