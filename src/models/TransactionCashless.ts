import { Transaction } from "./Transaction";

export type CashlessPaymentMethod = "qris" | "credit_paypal" | "credit_bca" | "bank_bca" | "bank_bni" | "bank_bri";

export function isCashlessPaymentMethod(value: unknown): value is CashlessPaymentMethod{
    if(typeof value !== "string")
        return false;

    switch(value){
        case "qris":
        case "credit_paypal":
        case "credit_bca":
        case "bank_bca":
        case "bank_bni":
        case "bank_bri":
            return true;

        default:
            return false;
    }
}

export interface TransactionCashless{
    transaction_cashless_id: number;
    transaction_id: Transaction["transaction_id"];
    external_transaction_id: string;
    cashless_payment_method: CashlessPaymentMethod;
}

export function isTransactionCashless(value: unknown): value is TransactionCashless{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("transaction_cashless_id" in value) || typeof value.transaction_cashless_id !== "number")
        return false;

    if(!("transaction_id" in value) || typeof value.transaction_id !== "number")
        return false;

    if(!("external_transaction_id" in value) || typeof value.external_transaction_id !== "string")
        return false;

    if(!("cashless_payment_method" in value) || !isCashlessPaymentMethod(value.cashless_payment_method))
        return false;
    
    return true;
}

export function isTransactionCashlessWithoutId(value: unknown): value is Omit<TransactionCashless, "transaction_cashless_id">{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("transaction_id" in value) || typeof value.transaction_id !== "number")
        return false;

    if(!("external_transaction_id" in value) || typeof value.external_transaction_id !== "string")
        return false;

    if(!("cashless_payment_method" in value) || !isCashlessPaymentMethod(value.cashless_payment_method))
        return false;
    
    return true;
}

export function isPartialTransactionCashless(value: unknown): value is Partial<TransactionCashless>{
    if(typeof value !== "object" || value === null)
        return false;

    if("transaction_cashless_id" in value && typeof value.transaction_cashless_id !== "number")
        return false;

    if("transaction_id" in value && typeof value.transaction_id !== "number")
        return false;

    if("external_transaction_id" in value && typeof value.external_transaction_id !== "string")
        return false;

    if("cashless_payment_method" in value && !isCashlessPaymentMethod(value.cashless_payment_method))
        return false;
    
    return true;
}