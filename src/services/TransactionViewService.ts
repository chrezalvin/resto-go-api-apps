import ServiceSupabase from "libraries/ServiceSupabase";
import { isTransactionView, TransactionView } from "models/TransactionView";

export class TransactionViewService{
    protected static readonly transactionViewPath: string = "transactionview";

    static transactionManager = new ServiceSupabase<TransactionView, "transaction_id">("transaction_id", TransactionViewService.transactionViewPath, {
        typeGuard: isTransactionView,
        useCache: false,
    });

    static async getTransactionViews(): Promise<TransactionView[]>{
        return await TransactionViewService.transactionManager.getAll();
    }

    static async getTransactionById(transaction_id: TransactionView["transaction_id"]): Promise<TransactionView | undefined>{
        return await TransactionViewService.transactionManager.get(transaction_id);
    }

    static async getTransactionBatch(transaction_ids: TransactionView["transaction_id"][]): Promise<TransactionView[]>{
        const transacitons = await TransactionViewService
            .transactionManager
            .queryBuilder((query) => query
                .select("*")
                .in("transaction_id", transaction_ids)
            );

        if(!Array.isArray(transacitons))
            throw new Error("Invalid transaction data!");

        return transacitons;
    }
}