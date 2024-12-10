import { Request, Response } from "express";
import { Transaction } from "models";
import { CustomerViewService } from "services/CustomerViewService";
import { TransactionService } from "services/OrderService";
import { TransactionFoodDetailService } from "services/TransactionFoodDetail";


export async function chef_food_branch_get(req: Request, res: Response){
    const branch_id = parseInt(req.params.branch_id);

    if(isNaN(branch_id))
        throw new Error("Invalid input data!");

    const customerViews = await CustomerViewService.getCustomerViewByBranch(branch_id);

    const transactions = await Promise.all(customerViews
        .filter((customerView) => customerView.transaction_id !== null)
        .map( async (customerView) => {
            const transaction = await TransactionService.getTransactionById(customerView.transaction_id!);
            const foods = await TransactionFoodDetailService.getTransactionFoodDetailByTransactionId(customerView.transaction_id!);

            return {
                customer: customerView,
                transaction: transaction as Transaction,
                foods: foods
            };
        })
    );

    res.status(200).json(transactions.filter((transaction) => !transaction.transaction.finished)); 
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