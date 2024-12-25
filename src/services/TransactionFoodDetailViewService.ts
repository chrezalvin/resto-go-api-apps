import { FileManagerFirebase } from "libraries/FileManagerFirebase";
import ServiceSupabase from "libraries/ServiceSupabase";
import { isTransactionFoodDetailView, TransactionFoodDetailView } from "models/TransactionFoodDetailView";

export class TransactionFoodDetailViewService{
    protected static readonly transactionFoodDetailViewPath: string = "transactionfooddetailview";
    protected static readonly transactionFoodDetailViewImgPath: string = "foodImg";

    static transactionFoodDetailViewManager = new ServiceSupabase<TransactionFoodDetailView, "transaction_food_detail_id">("transaction_food_detail_id", TransactionFoodDetailViewService.transactionFoodDetailViewPath, {
        typeGuard: isTransactionFoodDetailView,
        useCache: false,
    });

    static fileManager = new FileManagerFirebase(TransactionFoodDetailViewService.transactionFoodDetailViewImgPath);

    static async translateImageUrl(food: TransactionFoodDetailView): Promise<TransactionFoodDetailView>{
        if(food.img_path)
            food.img_path = await TransactionFoodDetailViewService.fileManager.getUrlFromPath(food.img_path);
        return food;
    }

    static async getTransactionFoodDetailViews(): Promise<TransactionFoodDetailView[]>{
        const list = await TransactionFoodDetailViewService.transactionFoodDetailViewManager.getAll();

        return await Promise.all(list.map(TransactionFoodDetailViewService.translateImageUrl));
    }

    static async getTransactionFoodDetailViewById(transaction_food_detail_id: TransactionFoodDetailView["transaction_food_detail_id"]): Promise<TransactionFoodDetailView | undefined>{
        const res = await TransactionFoodDetailViewService.transactionFoodDetailViewManager.get(transaction_food_detail_id);

        return res ? await TransactionFoodDetailViewService.translateImageUrl(res) : undefined;
    }

    static async getTransactionFoodDetailViewByTransactionId(transaction_id: TransactionFoodDetailView["transaction_id"]): Promise<TransactionFoodDetailView[]>{ 
        const transactionFoodDetailViews = await TransactionFoodDetailViewService
            .transactionFoodDetailViewManager
            .queryBuilder((query) => query
                .select("*")
                .eq("transaction_id", transaction_id)
            );

        if(!Array.isArray(transactionFoodDetailViews))
            throw new Error("Invalid transaction data!");

        return await Promise.all(transactionFoodDetailViews.map(TransactionFoodDetailViewService.translateImageUrl));
    }
}