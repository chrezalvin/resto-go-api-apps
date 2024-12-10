"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCustomer = isCustomer;
exports.isCustomerWithoutId = isCustomerWithoutId;
exports.isPartialCustomer = isPartialCustomer;
function isCustomer(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("customer_id" in value) || typeof value.customer_id !== "string")
        return false;
    if (!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;
    if (!("transaction_id" in value) || (typeof value.transaction_id !== "number" && value.transaction_id !== null))
        return false;
    return true;
}
function isCustomerWithoutId(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;
    if (!("transaction_id" in value) || (typeof value.transaction_id !== "number" && value.transaction_id !== null))
        return false;
    return true;
}
function isPartialCustomer(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if ("customer_id" in value && typeof value.customer_id !== "string")
        return false;
    if ("seat_id" in value && typeof value.seat_id !== "number")
        return false;
    if ("transaction_id" in value && (typeof value.transaction_id !== "number" && value.transaction_id !== null))
        return false;
    return true;
}
