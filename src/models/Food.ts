export interface Food{
    food_id: number;
    branch_id: number;
    food_name: string;
    food_desc: string;
    img_path: string | null;
    price: number;
    available: boolean;
}

export function isFood(value: unknown): value is Food{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("food_id" in value) || typeof value.food_id !== "number")
        return false;

    if(!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;

    if(!("food_name" in value) || typeof value.food_name !== "string")
        return false;

    if(!("food_desc" in value) || typeof value.food_desc !== "string")
        return false;

    if(!("img_path" in value) || (value.img_path !== null && typeof value.img_path !== "string"))
        return false;

    if(!("price" in value) || typeof value.price !== "number")
        return false;

    if(!("available" in value) || typeof value.available !== "boolean")
        return false;
    
    return true;
}

export function isFoodWithoutId(value: unknown): value is Omit<Food, "food_id">{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;

    if(!("food_name" in value) || typeof value.food_name !== "string")
        return false;

    if(!("food_desc" in value) || typeof value.food_desc !== "string")
        return false;

    if(!("img_path" in value) || (value.img_path !== null && typeof value.img_path !== "string"))
        return false;

    if(!("price" in value) || typeof value.price !== "number")
        return false;

    if(!("available" in value) || typeof value.available !== "boolean")
        return false;
    
    return true;
}

export function isPartialFood(value: unknown): value is Partial<Food>{
    if(typeof value !== "object" || value === null)
        return false;

    if("food_id" in value && typeof value.food_id !== "number")
        return false;

    if("branch_id" in value && typeof value.branch_id !== "number")
        return false;

    if("food_name" in value && typeof value.food_name !== "string")
        return false;

    if("food_desc" in value && typeof value.food_desc !== "string")
        return false;

    if("img_path" in value && (value.img_path !== null && typeof value.img_path !== "string"))
        return false;

    if("price" in value && typeof value.price !== "number")
        return false;

    if("available" in value && typeof value.available !== "boolean")
        return false;
    
    return true;
}