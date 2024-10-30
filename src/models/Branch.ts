export interface Branch{
    branch_id: number;
    branch_name: string;
    address: string;
    lat: number;
    long: number;
}

export function isBranch(value: unknown): value is Branch{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;

    if(!("branch_name" in value) || typeof value.branch_name !== "string")
        return false;

    if(!("address" in value) || typeof value.address !== "string")
        return false;
    
    return true;
}