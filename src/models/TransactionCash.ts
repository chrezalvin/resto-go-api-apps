import { Transaction } from "./Transaction";

export interface TransactionCash{
    transaction_cash_id: number;
    transaction_id: Transaction["transaction_id"];
    cashier_id: number;
}

export function isTransactionCash(value: unknown): value is TransactionCash{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("transaction_cash_id" in value) || typeof value.transaction_cash_id !== "number")
        return false;

    if(!("transaction_id" in value) || typeof value.transaction_id !== "number")
        return false;

    if(!("cashier_id" in value) || typeof value.cashier_id !== "number")
        return false;
    
    return true;
}

export function isTransactionCashWithoutId(value: unknown): value is Omit<TransactionCash, "transaction_cash_id">{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("transaction_id" in value) || typeof value.transaction_id !== "number")
        return false;

    if(!("cashier_id" in value) || typeof value.cashier_id !== "number")
        return false;
    
    return true;
}

export function isPartialTransactionCash(value: unknown): value is Partial<TransactionCash>{
    if(typeof value !== "object" || value === null)
        return false;

    if("transaction_cash_id" in value && typeof value.transaction_cash_id !== "number")
        return false;

    if("transaction_id" in value && typeof value.transaction_id !== "number")
        return false;

    if("cashier_id" in value && typeof value.cashier_id !== "number")
        return false;
    
    return true;
}
