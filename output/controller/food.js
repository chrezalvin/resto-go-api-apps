"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.food_get = food_get;
const FoodService_1 = require("../services/FoodService");
const SeatService_1 = require("../services/SeatService");
async function food_get(req, res) {
    const customer = req.customer;
    if (!customer)
        throw new Error("Invalid customer!");
    const branch = await SeatService_1.SeatService.getSeatById(customer.seat_id);
    const foods = await FoodService_1.FoodService.getFoodByBranch(branch.branch_id);
    res.json(foods);
}
