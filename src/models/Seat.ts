export interface Seat{
    seat_id: number;
    branch_id: number;
    seat_no: number;
}

export function isSeat(value: unknown): value is Seat{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;

    if(!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;

    if(!("seat_no" in value) || typeof value.seat_no !== "number")
        return false;
    
    return true;
}

export function isSeatWithoutId(value: unknown): value is Omit<Seat, "seat_id">{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;

    if(!("seat_no" in value) || typeof value.seat_no !== "number")
        return false;
    
    return true;
}

export function isPartialSeat(value: unknown): value is Partial<Seat>{
    if(typeof value !== "object" || value === null)
        return false;

    if("seat_id" in value && typeof value.seat_id !== "number")
        return false;

    if("branch_id" in value && typeof value.branch_id !== "number")
        return false;

    if("seat_no" in value && typeof value.seat_no !== "number")
        return false;
    
    return true;
}