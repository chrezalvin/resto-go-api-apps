const debug = require("debug")("Server:paymentController");

import { Request, Response } from 'express';
import { Food } from 'models';
import { CustomerService } from 'services/CustomerService';
import { FoodService } from 'services/FoodService';
import { createTransaction } from 'services/Midtrans';
import { TransactionService } from 'services/OrderService';
import { SeatService } from 'services/SeatService';
import { TransactionCashService } from 'services/TransactionCashService';
import { TransactionFoodDetailService } from 'services/TransactionFoodDetail';

interface PaymentOptions{
  orderId: string;
  grossAmount: number;
  customerDetails: Object;
}

interface FoodList{
  food_id: Food["food_id"];
  quantity: number;
  note?: string;
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

function isFoodList(value: unknown): value is FoodList{
  if(typeof value !== 'object' || value === null) return false;

  if("food_id" in value && typeof value.food_id !== 'number')
    return false;

  if("quantity" in value && typeof value.quantity !== 'number')
    return false;

  if("note" in value && typeof value.note !== 'string')
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
  debug("Received request:", req.body);
  const requestBody = req.body;
  const food_list = requestBody.food_list;
  const customer_id = requestBody.customer_id;
  const note = requestBody.note;

  // verification starts here
  // ensure the customer exists
  if(typeof customer_id !== 'string')
    return res.status(400).json({ error: 'Invalid input data, no customer selected' });

  // ensure the food list is an array
  if(!Array.isArray(food_list))
    return res.status(400).json({ error: 'Invalid input data, customer hasn\'t choose any food' });

  if(!food_list.every(isFoodList))
    return res.status(400).json({ error: 'Invalid input data, invalid food list' });

  const foods = await FoodService.getFoodByIds(food_list.map((food) => food.food_id));

  // ensure note is a string or undefined
  if(typeof note !== 'string' && typeof note !== 'undefined')
    return res.status(400).json({ error: 'Invalid input data, note must be a string' });

  // get the customer
  const customer = await CustomerService.getCustomerById(customer_id);

  if(!customer)
    return res.status(400).json({ error: 'Customer not found' });

  // checks if the customer has already have an active transaction
  if(customer.transaction_id)
    return res.status(400).json({ error: 'Customer already has an active transaction' });

  // get the branch id from the customer's seat
  const seat = await SeatService.getSeatById(customer.seat_id);
  
  // verification ends here

  // create the transaction
  const now = new Date();
  const nowPlus2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const transaction = await TransactionService.addTransaction({
    branch_id: seat.branch_id,
    eta: nowPlus2Hours.toISOString(),
    finished: false,
    note: note ?? null,
    payment_method: 'cash',
    price: foods.reduce((acc, food) => {
      const foodInList = food_list.find((foodInList) => foodInList.food_id === food.food_id);
      if(!foodInList)
        return acc;

      return acc + foodInList.quantity * food.price;
    }, 0),
  });

  if(!transaction)
    return res.status(400).json({ error: 'Failed to create transaction' });

  // add the transaction food list
  await TransactionFoodDetailService.createMultipleTransactionFoodDetails(food_list.map((food) => {
    return {
      food_id: food.food_id,
      note: food.note ?? null,
      transaction_id: transaction.transaction_id,
      quantity: food.quantity,
    }
  }));

  // add the transaction to cash
  await TransactionCashService.addTransactionCash({
    cashier_id: 1,
    transaction_id: transaction.transaction_id,
  });

  // update the customer's transaction id
  const customerAfterTransaction = await CustomerService.updateCustomer(customer_id, { transaction_id: transaction.transaction_id });

  if(!customerAfterTransaction || !customerAfterTransaction.transaction_id)
    return res.status(400).json({ error: 'Customer not updated!' });

  // get the transaction details based on the transaction id in the customer
  const transactionDetails = await TransactionService.getTransactionById(customerAfterTransaction.transaction_id);

  if(!transactionDetails)
    return res.status(400).json({ error: 'Transaction not found' });

  res.status(200).json(transactionDetails);
}

// checks if the customer has an active transaction, then returns the transaction details
export const payment_customer_get = async (req: Request, res: Response) => {
  const customer = req.customer;

  if(!customer)
    return res.status(400).json({ error: 'Invalid customer' });

  if(!customer.transaction_id)
    return res.status(400).json({ error: 'No active transaction' });

  // get the transaction details
  const transaction = await TransactionService.getTransactionById(customer.transaction_id);

  if(!transaction)
    return res.status(400).json({ error: 'Transaction not found' });

  res.status(200).json(transaction);
}

export const transaction_finalize_get = async (req: Request, res: Response) => {
  const transaction_id = parseInt(req.params.transaction_id);

  if(isNaN(transaction_id))
    return res.status(400).json({ error: 'Invalid input data' });

  const transaction = await TransactionService.updateTransaction(transaction_id, { finished: true });

  if(!transaction)
    return res.status(400).json({ error: 'Transaction not found' });

  res.status(200).json(transaction);
}