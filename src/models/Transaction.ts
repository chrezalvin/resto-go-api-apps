import { Food } from "./Food";

export interface Transaction{
    transaction_id: number;
    branch_id: number;
    price: number;
    foodList: Food["food_id"][];
}

export function isTransaction(value: unknown): value is Transaction{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("transaction_id" in value) || typeof value.transaction_id !== "number")
        return false;

    if(!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;

    if(!("price" in value) || typeof value.price !== "number")
        return false;

    if(!("foodList" in value) || !Array.isArray(value.foodList) || !value.foodList.every((item) => typeof item === "number"))
        return false;
    
    return true;
}

export function isTransactionWithoutId(value: unknown): value is Omit<Transaction, "transaction_id">{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;

    if(!("price" in value) || typeof value.price !== "number")
        return false;

    if(!("foodList" in value) || !Array.isArray(value.foodList) || !value.foodList.every((item) => typeof item === "number"))
        return false;
    
    return true;
}

export function isPartialTransaction(value: unknown): value is Partial<Transaction>{
    if(typeof value !== "object" || value === null)
        return false;

    if("transaction_id" in value && typeof value.transaction_id !== "number")
        return false;

    if("branch_id" in value && typeof value.branch_id !== "number")
        return false;

    if("price" in value && typeof value.price !== "number")
        return false;

    if("foodList" in value && (!Array.isArray(value.foodList) || !value.foodList.every((item) => typeof item === "number")))
        return false;
    
    return true;
}