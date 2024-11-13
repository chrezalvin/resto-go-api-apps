export interface Order{
    order_id: number;
    seat_id: number;
    estimated_time: Date;
    price: number;
}

export function isOrder(value: unknown): value is Order{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("order_id" in value) || typeof value.order_id !== "number")
        return false;

    if(!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;

    if(!("estimated_time" in value) || !(value.estimated_time instanceof Date))
        return false;

    if(!("price" in value) || typeof value.price !== "number")
        return false;
    
    return true;
}

export function isOrderWithoutId(value: unknown): value is Omit<Order, "order_id">{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;

    if(!("estimated_time" in value) || !(value.estimated_time instanceof Date))
        return false;

    if(!("price" in value) || typeof value.price !== "number")
        return false;
    
    return true;
}

export function isPartialOrder(value: unknown): value is Partial<Order>{
    if(typeof value !== "object" || value === null)
        return false;

    if("order_id" in value && typeof value.order_id !== "number")
        return false;

    if("seat_id" in value && typeof value.seat_id !== "number")
        return false;

    if("estimated_time" in value && !(value.estimated_time instanceof Date))
        return false;

    if("price" in value && typeof value.price !== "number")
        return false;
    
    return true;
}