import express, { Request, Response } from 'express';
import { createTransaction } from '../services/Midtrans';

const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
  const { orderId, grossAmount, customerDetails } = req.body;

  try {
    const result = await createTransaction(orderId, grossAmount, customerDetails);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error creating transaction:', error.message);
    res.status(500).json({
      error: 'Failed to create transaction',
      message: error.message,
    });
  }
});

export default router;
