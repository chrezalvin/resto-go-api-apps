import { Branch } from "./Branch";

export interface Staff{
    staff_id: number;
    name: string;
    branch: Branch["branch_id"];
}

export function isStaff(value: unknown): value is Staff{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("staff_id" in value) || typeof value.staff_id !== "number")
        return false;

    if(!("name" in value) || typeof value.name !== "string")
        return false;

    if(!("branch" in value) || typeof value.branch !== "number")
        return false;
    
    return true;
}