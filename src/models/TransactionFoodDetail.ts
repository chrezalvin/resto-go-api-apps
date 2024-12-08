import { Food } from "./Food";
import { Transaction } from "./Transaction";

export interface TransactionFoodDetail{
    transaction_food_detail_id: number;
    transaction_id: Transaction["transaction_id"];
    food_id: Food["food_id"];
    note: string | null;
    quantity: number;
}

export function isTransactionFoodDetail(value: unknown): value is TransactionFoodDetail{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("transaction_food_detail_id" in value) || typeof value.transaction_food_detail_id !== "number")
        return false;

    if(!("transaction_id" in value) || typeof value.transaction_id !== "number")
        return false;

    if(!("food_id" in value) || typeof value.food_id !== "number")
        return false;

    if(!("note" in value) || (typeof value.note !== "number" && value.note !== null))
        return false;

    if(!("quantity" in value) || typeof value.quantity !== "number")
        return false;
    
    return true;
}

export function isTransactionFoodDetailWithoutId(value: unknown): value is Omit<TransactionFoodDetail, "transaction_detail_id">{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("transaction_id" in value) || typeof value.transaction_id !== "number")
        return false;

    if(!("food_id" in value) || typeof value.food_id !== "number")
        return false;

    if(!("note" in value) || (typeof value.note !== "number" && value.note !== null))
        return false;

    if(!("quantity" in value) || typeof value.quantity !== "number")
        return false;
    
    return true;
}

export function isPartialTransactionFoodDetail(value: unknown): value is Partial<TransactionFoodDetail>{
    if(typeof value !== "object" || value === null)
        return false;

    if("transaction_food_detail_id" in value && typeof value.transaction_food_detail_id !== "number")
        return false;

    if("transaction_id" in value && typeof value.transaction_id !== "number")
        return false;

    if("food_id" in value && typeof value.food_id !== "number")
        return false;

    if("note" in value && (typeof value.note !== "number" && value.note !== null))
        return false;

    if("quantity" in value && typeof value.quantity !== "number")
        return false;
    
    return true;
}