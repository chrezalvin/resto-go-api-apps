"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTransaction = isTransaction;
exports.isTransactionWithoutId = isTransactionWithoutId;
exports.isPartialTransaction = isPartialTransaction;
function isTransaction(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("transaction_id" in value) || typeof value.transaction_id !== "number")
        return false;
    if (!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;
    if (!("price" in value) || typeof value.price !== "number")
        return false;
    if (!("foodList" in value) || !Array.isArray(value.foodList) || !value.foodList.every((item) => typeof item === "number"))
        return false;
    return true;
}
function isTransactionWithoutId(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;
    if (!("price" in value) || typeof value.price !== "number")
        return false;
    if (!("foodList" in value) || !Array.isArray(value.foodList) || !value.foodList.every((item) => typeof item === "number"))
        return false;
    return true;
}
function isPartialTransaction(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if ("transaction_id" in value && typeof value.transaction_id !== "number")
        return false;
    if ("branch_id" in value && typeof value.branch_id !== "number")
        return false;
    if ("price" in value && typeof value.price !== "number")
        return false;
    if ("foodList" in value && (!Array.isArray(value.foodList) || !value.foodList.every((item) => typeof item === "number")))
        return false;
    return true;
}
