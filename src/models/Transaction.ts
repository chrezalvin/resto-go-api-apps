export interface Transaction{
    transaction_id: number;
    branch_id: number;
    price: number;
    note: string | null;
    finished: boolean;
    payment_method: "cash" | "cashless";
    eta: string;
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

    if(!("note" in value) || (typeof value.note !== "string" && value.note !== null))
        return false;

    if(!("eta" in value) || typeof value.eta !== "string")
        return false;

    if(!("finished" in value) || typeof value.finished !== "boolean")
        return false;

    if(!("payment_method" in value) || (value.payment_method !== "cash" && value.payment_method !== "cashless"))
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

    if(!("note" in value) || (typeof value.note !== "string" && value.note !== null))
        return false;

    if(!("eta" in value) || typeof value.eta !== "string")
        return false;

    if(!("finished" in value) || typeof value.finished !== "boolean")
        return false;

    if(!("payment_method" in value) || (value.payment_method !== "cash" && value.payment_method !== "cashless"))
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

    if("note" in value && (typeof value.note !== "string" && value.note !== null))
        return false;

    if("eta" in value && typeof value.eta !== "string")
        return false;

    if("finished" in value && typeof value.finished !== "boolean")
        return false;

    if("payment_method" in value && (value.payment_method !== "cash" && value.payment_method !== "cashless"))
        return false;
    
    return true;
}