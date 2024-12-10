"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBranch = isBranch;
exports.isBranchWithoutId = isBranchWithoutId;
exports.isPartialBranch = isPartialBranch;
function isBranch(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;
    if (!("branch_name" in value) || typeof value.branch_name !== "string")
        return false;
    if (!("address" in value) || typeof value.address !== "string")
        return false;
    return true;
}
function isBranchWithoutId(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("branch_name" in value) || typeof value.branch_name !== "string")
        return false;
    if (!("address" in value) || typeof value.address !== "string")
        return false;
    return true;
}
function isPartialBranch(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if ("branch_id" in value && typeof value.branch_id !== "number")
        return false;
    if ("branch_name" in value && typeof value.branch_name !== "string")
        return false;
    if ("address" in value && typeof value.address !== "string")
        return false;
    return true;
}
