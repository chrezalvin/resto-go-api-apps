import ServiceSupabase from "libraries/ServiceSupabase";
import { isTransactionFoodDetail, TransactionFoodDetail } from "models/TransactionFoodDetail";

export class TransactionFoodDetailService {
    protected static readonly transactionDetailPath: string = "TransactionFoodDetail";

    static transactionManager = new ServiceSupabase<TransactionFoodDetail, "transaction_food_detail_id">("transaction_food_detail_id", TransactionFoodDetailService.transactionDetailPath, {
        typeGuard: isTransactionFoodDetail,
        useCache: false,
    });

    static async getTransactionFoodDetailById(transactionFoodDetailId: TransactionFoodDetail["transaction_food_detail_id"]) {
        return await TransactionFoodDetailService.transactionManager.get(transactionFoodDetailId);
    }

    static async createMultipleTransactionFoodDetails(foodDetails: Omit<TransactionFoodDetail, "transaction_food_detail_id">[]){
        return await TransactionFoodDetailService
            .transactionManager
            .queryBuilder(
                query => query
                    .upsert(foodDetails)
                    .select("*")
            );
    }

    static async getTransactionFoodDetailByTransactionId(transaction_id: TransactionFoodDetail["transaction_id"]) {
        return await TransactionFoodDetailService
            .transactionManager
            .queryBuilder(query => query
                .select("*")
                .eq("transaction_id", transaction_id)
            );
    }
}