import { Branch } from "./Branch";
import { Seat } from "./Seat";
import { Transaction } from "./Transaction";

export interface Customer{
    customer_id: string;
    seat_id: Seat["seat_id"];
    transaction_id: Transaction["transaction_id"] | null;
}

export function isCustomer(value: unknown): value is Customer{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("customer_id" in value) || typeof value.customer_id !== "string")
        return false;

    if(!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;

    if(!("transaction_id" in value) || (typeof value.transaction_id !== "number" && value.transaction_id !== null))
        return false;
    
    return true;
}

export function isCustomerWithoutId(value: unknown): value is Omit<Customer, "customer_id">{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;

    if(!("transaction_id" in value) || (typeof value.transaction_id !== "number" && value.transaction_id !== null))
        return false;
    
    return true;
}

export function isPartialCustomer(value: unknown): value is Partial<Customer>{
    if(typeof value !== "object" || value === null)
        return false;

    if("customer_id" in value && typeof value.customer_id !== "string")
        return false;

    if("seat_id" in value && typeof value.seat_id !== "number")
        return false;

    if("transaction_id" in value && (typeof value.transaction_id !== "number" && value.transaction_id !== null))
        return false;
    
    return true;
}