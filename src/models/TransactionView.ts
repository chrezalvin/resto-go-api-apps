import { Branch } from "./Branch";
import { isTransaction, Transaction } from "./Transaction";

export interface TransactionView extends Transaction, Omit<Branch, "lat" | "long">{
    created_at: string;
    updated_at: string;
}

export function isTransactionView(value: unknown): value is TransactionView{
    if(!isTransaction(value)) return false;

    if(!("branch_id" in value) || typeof value.branch_id !== "number") 
            return false;

    if(!("branch_name" in value) || typeof value.branch_name !== "string") 
        return false;

    if(!("address" in value) || typeof value.address !== "string")
        return false;

    if(!("created_at" in value) || typeof value.created_at !== "string")
        return false;

    if(!("updated_at" in value) || typeof value.updated_at !== "string")
        return false;

    return true;
}