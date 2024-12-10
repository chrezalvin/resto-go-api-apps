import ServiceSupabase from "libraries/ServiceSupabase";
import { isTransactionCashless, TransactionCashless } from "models/TransactionCashless";

export class TransactionCashlessService {
    protected static readonly tranactionCashlessPath: string = "TransactionCashless";

    static transactionManager = new ServiceSupabase<TransactionCashless, "transaction_cashless_id">("transaction_cashless_id", TransactionCashlessService.tranactionCashlessPath, {
        typeGuard: isTransactionCashless,
        useCache: false,
    });

    static async getTransactionCashlessByTransactionId(transaction_id: TransactionCashless["transaction_id"]) {
        return await TransactionCashlessService
            .transactionManager
            .queryBuilder(query => query
                .select("*")
                .eq("transaction_id", transaction_id)
            );
    }

    static async addTransactionCashless(transactionCashless: Omit<TransactionCashless, "transaction_cashless_id">) {
        return await TransactionCashlessService
            .transactionManager
            .add(transactionCashless);
    }
}