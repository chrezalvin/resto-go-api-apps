import { Request, Response } from 'express';
import { createTransaction as createMidtransTransaction } from '../services/Midtrans';

export const createTransaction = async (req: Request, res: Response) => {
  const { orderId, grossAmount, customerDetails } = req.body;

  try {
    const transaction = await createMidtransTransaction(orderId, grossAmount, customerDetails);

    console.log("Transaksi berhasil dibuat:", transaction);

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", (error as any).message);
    res.status(500).json({ error: "Failed to create transaction", message: (error as any).message });
  }
};