import { Food, isFood } from "./Food";
import { isTransactionFoodDetail, TransactionFoodDetail } from "./TransactionFoodDetail";

export interface TransactionFoodDetailView extends TransactionFoodDetail, Food{

}

export function isTransactionFoodDetailView(arg: unknown): arg is TransactionFoodDetailView{
    if(!isFood(arg))
        return false;

    if(!isTransactionFoodDetail(arg))
        return false;

    return true;
}