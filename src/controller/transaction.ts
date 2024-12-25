import { Request, Response } from 'express';
import { TransactionViewService } from 'services/TransactionViewService';

export async function transaction_get_all(req: Request, res: Response){
    const transactionViews = await TransactionViewService.getTransactionViews();

    res.status(200).json(transactionViews);
}

export async function transaction_get_id(req: Request, res: Response){
    const id = parseInt(req.params.id);

    if(isNaN(id))
        throw new Error("Invalid input data!");

    const transactionView = await TransactionViewService.getTransactionById(id);

    if(!transactionView)
        throw new Error("Transaction not found!");

    res.status(200).json(transactionView);
}

export async function transaction_post_batch(req: Request, res: Response){
    const ids = req.body.ids;

    if(!Array.isArray(ids))
        throw new Error("Invalid input data!");

    const transactionViews = await TransactionViewService.getTransactionBatch(ids);

    res.status(200).json(transactionViews);
}