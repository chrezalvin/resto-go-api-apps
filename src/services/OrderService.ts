import ServiceSupabase from "libraries/ServiceSupabase";
import { Transaction, isTransaction } from "models";

export class TransactionService{
    protected static readonly transactionPath: string = "Transaction";

    static transactionManager = new ServiceSupabase<Transaction, "transaction_id">("transaction_id", TransactionService.transactionPath, {
        typeGuard: isTransaction,
        useCache: false,
    });

    static async getTransactions(){
        return await TransactionService.transactionManager.getAll();
    }

    static async getTransactionById(transaction_id: number){
        return await TransactionService.transactionManager.get(transaction_id);
    }

    static async getTransactionByBranch(branch_id: number): Promise<Transaction[]>{
        const res = await TransactionService
            .transactionManager
            .queryBuilder((query) => query
                .select("*")
                .eq("branch_id", branch_id)
            );

        if(!Array.isArray(res))
            return [];

        return res;
    }

    static async addTransaction(transaction: Omit<Transaction, "transaction_id">){
        return await TransactionService.transactionManager.add(transaction);
    }

    static async updateTransaction(transaction_id: number, transaction: Partial<Omit<Transaction, "transaction_id">>){
        return await TransactionService.transactionManager.update(transaction_id, transaction);
    }

    static async deleteTransaction(transaction_id: number){
        return await TransactionService.transactionManager.delete(transaction_id);
    }
}