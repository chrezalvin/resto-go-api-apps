import { Request, Response, NextFunction } from "express";

export const validatePaymentInput = (req: Request, res: Response, next: NextFunction) => {
  const { orderId, grossAmount, customerDetails } = req.body;

  if (!orderId || !grossAmount || !customerDetails) {
    return res.status(400).json({ error: "Missing required fields: orderId, grossAmount, or customerDetails" });
  }

  if (typeof grossAmount !== "number" || grossAmount <= 0) {
    return res.status(400).json({ error: "grossAmount must be a positive number" });
  }

  next();
};
