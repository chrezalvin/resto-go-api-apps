import ServiceSupabase from "libraries/ServiceSupabase";
import { isTransactionCashless, TransactionCashless } from "models/TransactionCashless";

export class TransactionCashlessService {
    protected static readonly tranactionCashlessPath: string = "TransactionCashless";

    static transactionManager = new ServiceSupabase<TransactionCashless, "transaction_cashless_id">("transaction_cashless_id", TransactionCashlessService.tranactionCashlessPath, {
        typeGuard: isTransactionCashless,
        useCache: false,
    });

    static async getTransactionCashlessByTransactionId(transaction_id: TransactionCashless["transaction_id"]) {
        const transactionCashless = await TransactionCashlessService
            .transactionManager
            .queryBuilder(query => query
                .select("*")
                .eq("transaction_id", transaction_id)
                .limit(1)
                .single()
            );

        if(Array.isArray(transactionCashless))
            throw new Error("Transaction Cashless not found!");

        return transactionCashless;
    }

    static async addTransactionCashless(transactionCashless: Omit<TransactionCashless, "transaction_cashless_id">) {
        return await TransactionCashlessService
            .transactionManager
            .add(transactionCashless);
    }
}