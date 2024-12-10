"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSeat = isSeat;
exports.isSeatWithoutId = isSeatWithoutId;
exports.isPartialSeat = isPartialSeat;
function isSeat(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;
    if (!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;
    if (!("seat_no" in value) || typeof value.seat_no !== "number")
        return false;
    return true;
}
function isSeatWithoutId(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;
    if (!("seat_no" in value) || typeof value.seat_no !== "number")
        return false;
    return true;
}
function isPartialSeat(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if ("seat_id" in value && typeof value.seat_id !== "number")
        return false;
    if ("branch_id" in value && typeof value.branch_id !== "number")
        return false;
    if ("seat_no" in value && typeof value.seat_no !== "number")
        return false;
    return true;
}
