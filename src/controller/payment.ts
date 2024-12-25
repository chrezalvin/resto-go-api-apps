const debug = require("debug")("Server:paymentController");

import { Request, Response } from 'express';
import { Customer, Food } from 'models';
import { CustomerService } from 'services/CustomerService';
import { CustomerViewService } from 'services/CustomerViewService';
import { FoodService } from 'services/FoodService';
import { createTransaction } from 'services/Midtrans';
import { TransactionService } from 'services/OrderService';
import { SeatService } from 'services/SeatService';
import { TransactionCashlessService } from 'services/TransactionCashlessService';
import { TransactionCashService } from 'services/TransactionCashService';
import { TransactionFoodDetailService } from 'services/TransactionFoodDetail';
import { notifyClientsById } from 'webSocketConfig';

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

async function createTransaction2(method: "cash" | "cashless", option: {
  customer_id: Customer["customer_id"],
  food_list: FoodList[],
  note?: string,
}){
  // proxy
  const transactionData = {
    orderId: "ORDER-1733593373831",
    grossAmount: 5000000,
    customerDetails: {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "081234567890"
    }
  };
  const customerView = await CustomerViewService.getCustomerView(option.customer_id);
  const foods = await FoodService.getFoodByIds(option.food_list.map((food) => food.food_id));

  if(!customerView)
    throw new Error('Customer not found');

  if(customerView.transaction_id)
    throw new Error('Customer already has an active transaction');

    // create the transaction
    const now = new Date();
    const nowPlus1Hours = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    const transaction = await TransactionService.addTransaction({
      branch_id: customerView.branch_id,
      eta: nowPlus1Hours.toISOString(),
      finished: false,
      note: option.note ?? null,
      payment_method: 'cash',
      price: foods.reduce((acc, food) => {
        const foodInList = option.food_list.find((foodInList) => foodInList.food_id === food.food_id);
        if(!foodInList)
          return acc;
  
        return acc + foodInList.quantity * food.price;
      }, 0),
    });

    if(!transaction)
      throw new Error('Failed to create transaction');
  
    // add the transaction food list
    await TransactionFoodDetailService
      .createMultipleTransactionFoodDetails(option.food_list.map((food) => {
        return {
          food_id: food.food_id,
          note: food.note ?? null,
          transaction_id: transaction.transaction_id,
          quantity: food.quantity,
        }
      }));
  
    if(method === 'cash')
      await TransactionCashService.addTransactionCash({
        cashier_id: 1,
        transaction_id: transaction.transaction_id,
      });
    else{
      const transactionMidtrans = await createTransaction(transactionData.orderId, transactionData.grossAmount, transactionData.customerDetails);

      await TransactionCashlessService
        .addTransactionCashless({
          external_transaction_id: transactionMidtrans.transactionId ||  (transactionMidtrans as any).id || "abcde",
          cashless_payment_method: "qris",
          transaction_id: transaction.transaction_id,
        });
    }
  
    // update the customer's transaction id
    const customerAfterTransaction = await CustomerService.updateCustomer(option.customer_id, { transaction_id: transaction.transaction_id });

    return customerAfterTransaction;
}

export const payment_create_post = async (req: Request, res: Response) => {
  if(!req.customer)
    throw new Error('Invalid customer!');

  debug("Received request:", req.body);
  // proxy
  const transactionData = {
    orderId: "ORDER-1733593373831",
    grossAmount: 5000000,
    customerDetails: {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "081234567890"
    }
  };
  const requestBody = req.body;
  const food_list = requestBody.food_list;
  const customer = req.customer;
  const note = requestBody.note;

  // verification starts here   
  // ensure the food list is an array
  if(!Array.isArray(food_list))
    return res.status(400).json({ error: 'Invalid input data, customer hasn\'t choose any food' });

  if(!food_list.every(isFoodList))
    return res.status(400).json({ error: 'Invalid input data, invalid food list' });

  const foods = await FoodService.getFoodByIds(food_list.map((food) => food.food_id));

  // ensure note is a string or undefined
  if(typeof note !== 'string' && typeof note !== 'undefined')
    return res.status(400).json({ error: 'Invalid input data, note must be a string' });

  // checks if the customer has already have an active transaction
  if(customer.transaction_id)
    return res.status(400).json({ error: 'Customer already has an active transaction' });

  // get the branch id from the customer's seat
  const seat = await SeatService.getSeatById(customer.seat_id);
  
  if(!isPaymentOptions(transactionData))
    return res.status(400).json({ error: 'Invalid input data' });

  // verification ends here
  const customerAfterTransaction = await createTransaction2("cashless", {
    customer_id: customer.customer_id,
    food_list,
    note,
  });

  if(!customerAfterTransaction || !customerAfterTransaction.transaction_id)
    return res.status(400).json({ error: 'Customer not updated!' });

  // get the transaction details based on the transaction id in the customer
  const transactionDetails = await TransactionService.getTransactionById(customerAfterTransaction.transaction_id);

  if(!transactionDetails)
    return res.status(400).json({ error: 'Transaction not found' });

  res.status(200).json(transactionDetails);

  notifyClientsById(seat.branch_id, "New transaction created");
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

  const customerAfterTransaction = await createTransaction2("cash", {
    customer_id,
    food_list,
    note,
  });

  if(!customerAfterTransaction || !customerAfterTransaction.transaction_id)
    return res.status(400).json({ error: 'Customer not updated!' });

  // get the transaction details based on the transaction id in the customer
  const transactionDetails = await TransactionService.getTransactionById(customerAfterTransaction.transaction_id);

  if(!transactionDetails)
    return res.status(400).json({ error: 'Transaction not found' });

  res.status(200).json(transactionDetails);

  notifyClientsById(seat.branch_id, "New transaction created");
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

export const payment_checkout_post = async (req: Request, res: Response) => {
  const foodList = req.body;
  const customer = req.customer;

  if(!customer)
    return res.status(400).json({ error: 'Invalid customer' });

  if(!Array.isArray(foodList))
    return res.status(400).json({ error: 'Invalid input data' });

  if(!foodList.every(isFoodList))
    return res.status(400).json({ error: 'Invalid input data' });

  const foods = await FoodService.getFoodByIds(foodList.map((food) => food.food_id));
  const foodsWithPrice = foods.map((food) => {
    const foodInList = foodList.find((foodInList) => foodInList.food_id === food.food_id);

    return {
      ...food,
      quantity: foodInList!.quantity,
      price: food.price * foodInList!.quantity,
    }
  })
  const price = foodsWithPrice.reduce((acc, food) => acc + food.price, 0);

  res.status(200).json({
    foodsWithPrice,
    totalPrice: price,
  });
}