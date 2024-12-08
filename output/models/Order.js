"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrder = isOrder;
exports.isOrderWithoutId = isOrderWithoutId;
exports.isPartialOrder = isPartialOrder;
function isOrder(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("order_id" in value) || typeof value.order_id !== "number")
        return false;
    if (!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;
    if (!("estimated_time" in value) || !(value.estimated_time instanceof Date))
        return false;
    if (!("price" in value) || typeof value.price !== "number")
        return false;
    return true;
}
function isOrderWithoutId(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;
    if (!("estimated_time" in value) || !(value.estimated_time instanceof Date))
        return false;
    if (!("price" in value) || typeof value.price !== "number")
        return false;
    return true;
}
function isPartialOrder(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if ("order_id" in value && typeof value.order_id !== "number")
        return false;
    if ("seat_id" in value && typeof value.seat_id !== "number")
        return false;
    if ("estimated_time" in value && !(value.estimated_time instanceof Date))
        return false;
    if ("price" in value && typeof value.price !== "number")
        return false;
    return true;
}
