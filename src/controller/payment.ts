const debug = require("debug")("Server:paymentController");

import { Request, Response } from 'express';
import { CustomerService } from 'services/CustomerService';
import { createTransaction } from 'services/Midtrans';
import { TransactionService } from 'services/OrderService';
import { SeatService } from 'services/SeatService';

interface PaymentOptions{
  orderId: string;
  grossAmount: number;
  customerDetails: Object;
}

function isPaymentOptions(value: unknown): value is PaymentOptions{
    if(typeof value !== 'object' || value === null) return false;

    if("orderId" in value && typeof value.orderId !== 'string') 
      return false;

    if("grossAmount" in value && typeof value.grossAmount !== 'number')
      return false;

    if("customerDetails" in value && typeof value.customerDetails !== 'object')
      return false;

    return true;
}

export const payment_create_post = async (req: Request, res: Response) => {
  const body = req.body;

  const customer = req.customer;

  if(!customer)
    return res.status(400).json({ error: 'Invalid customer' });

  if(customer.transaction_id){
    debug("Customer has already created a transaction, cancelling request");
    return res.status(400).json({ error: 'Customer already has an active transaction' });
  }

  if(!isPaymentOptions(body))
    return res.status(400).json({ error: 'Invalid input data' });

  debug("Received data:", body);

  const transaction = await createTransaction(body.orderId, body.grossAmount, body.customerDetails);

  res.status(200).json(transaction);
}

export const payment_cash_confirm_post = async (req: Request, res: Response) => {
  const requestBody = req.body;

  // ensure the customer exists
  if(!("customer_id" in requestBody) || typeof requestBody.customer_id !== 'string')
    return res.status(400).json({ error: 'Invalid input data, no customer selected' });

  // get the customer
  const customer = await CustomerService.getCustomerById(requestBody.customer_id);

  if(!customer)
    return res.status(400).json({ error: 'Customer not found' });

  // get the branch id from the customer's seat
  const seat = await SeatService.getSeatById(customer.seat_id);

  const now = new Date();
  const nowPlus2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  TransactionService.addTransaction({
    branch_id: seat.branch_id,
    eta: nowPlus2Hours.toISOString(),
    finished: false,
    note: 'this is a note',
    payment_method: 'cash',
    price: 0,
  });
}

// checks if the customer has an active transaction, then returns the transaction details
export const payment_customer_get = async (req: Request, res: Response) => {
  const customer = req.customer;

  if(!customer)
    return res.status(400).json({ error: 'Invalid customer' });

  if(!customer.transaction_id)
    return res.status(400).json({ error: 'No active transaction' });

  // get the transaction details
  const transaction = TransactionService.getTransactionById(customer.transaction_id);

  if(!transaction)
    return res.status(400).json({ error: 'Transaction not found' });

  res.status(200).json(transaction);
}