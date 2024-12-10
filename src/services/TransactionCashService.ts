import ServiceSupabase from "libraries/ServiceSupabase";
import { isTransactionCash, TransactionCash } from "models/TransactionCash";

export class TransactionCashService {
    protected static readonly transactionCashPath: string = "TransactionCash";

    static transactionManager = new ServiceSupabase<TransactionCash, "transaction_cash_id">("transaction_cash_id", TransactionCashService.transactionCashPath, {
        typeGuard: isTransactionCash,
        useCache: false,
    });

    static async getTransactionCashByTransactionId(transaction_id: TransactionCash["transaction_id"]) {
        return await TransactionCashService
            .transactionManager
            .queryBuilder(query => query
                .select("*")
                .eq("transaction_id", transaction_id)
            );
    }

    static async addTransactionCash(transactionCash: Omit<TransactionCash, "transaction_cash_id">) {
        return await TransactionCashService.transactionManager.add(transactionCash);
    }
}