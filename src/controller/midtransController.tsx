// controllers/midtransController.ts

import { Request, Response } from 'express';

export const handleMidtransWebhook = (req: Request, res: Response) => {
  const notification = req.body;  // Webhook body from Midtrans

  const { order_id, transaction_status, payment_type } = notification;

  // Logika untuk menangani status transaksi
  switch (transaction_status) {
    case 'settlement':
      // Pembayaran berhasil
      console.log(`Order ${order_id} is successful (settlement).`);
      // Update status transaksi di database
      break;
    case 'cancel':
      // Pembayaran dibatalkan
      console.log(`Order ${order_id} was cancelled.`);
      // Update status transaksi di database
      break;
    case 'pending':
      // Pembayaran dalam status pending
      console.log(`Order ${order_id} is pending.`);
      // Update status transaksi di database
      break;
    default:
      console.log(`Unhandled transaction status: ${transaction_status}`);
  }

  // Mengirimkan response ke Midtrans
  res.status(200).send('OK');
};
