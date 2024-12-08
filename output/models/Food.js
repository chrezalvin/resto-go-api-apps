"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFood = isFood;
exports.isFoodWithoutId = isFoodWithoutId;
exports.isPartialFood = isPartialFood;
function isFood(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("food_id" in value) || typeof value.food_id !== "number")
        return false;
    if (!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;
    if (!("food_name" in value) || typeof value.food_name !== "string")
        return false;
    if (!("food_desc" in value) || typeof value.food_desc !== "string")
        return false;
    if (!("img_path" in value) || (value.img_path !== null && typeof value.img_path !== "string"))
        return false;
    if (!("price" in value) || typeof value.price !== "number")
        return false;
    if (!("available" in value) || typeof value.available !== "boolean")
        return false;
    return true;
}
function isFoodWithoutId(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;
    if (!("food_name" in value) || typeof value.food_name !== "string")
        return false;
    if (!("food_desc" in value) || typeof value.food_desc !== "string")
        return false;
    if (!("img_path" in value) || (value.img_path !== null && typeof value.img_path !== "string"))
        return false;
    if (!("price" in value) || typeof value.price !== "number")
        return false;
    if (!("available" in value) || typeof value.available !== "boolean")
        return false;
    return true;
}
function isPartialFood(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if ("food_id" in value && typeof value.food_id !== "number")
        return false;
    if ("branch_id" in value && typeof value.branch_id !== "number")
        return false;
    if ("food_name" in value && typeof value.food_name !== "string")
        return false;
    if ("food_desc" in value && typeof value.food_desc !== "string")
        return false;
    if ("img_path" in value && (value.img_path !== null && typeof value.img_path !== "string"))
        return false;
    if ("price" in value && typeof value.price !== "number")
        return false;
    if ("available" in value && typeof value.available !== "boolean")
        return false;
    return true;
}
