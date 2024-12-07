export interface Admin{
    admin_id: number;
    username: string;
    password: string;
    created_at: string;
} 

export function isAdmin(val: unknown): val is Admin{
    if(typeof val !== "object" || val === null)
        return false;

    if(!("admin_id" in val) || typeof val.admin_id !== "number")
        return false;

    if(!("username" in val) || typeof val.username !== "string")
        return false;

    if(!("password" in val) || typeof val.password !== "string")
        return false;

    if(!("created_at" in val) || typeof val.created_at !== "string")
        return false;

    return true;
}

export function isAdminWithoutId(val: unknown): val is Omit<Admin, "admin_id" | "created_at">{
    if(typeof val !== "object" || val === null)
        return false;

    if(!("username" in val) || typeof val.username !== "string")
        return false;

    if(!("password" in val) || typeof val.password !== "string")
        return false;

    return true;
}