"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction_create = transaction_create;
async function transaction_create(req, res) {
    const food_ids = req.body.food_ids;
    if (!Array.isArray(food_ids))
        throw new Error("Invalid input data!");
}
