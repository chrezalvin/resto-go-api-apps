import { Request, Response } from "express";
import { FoodService } from "services/FoodService";
import { SeatService } from "services/SeatService";

export async function food_get(req: Request, res: Response){
    const customer = req.customer;

    if(!customer)
        throw new Error("Invalid customer!");

    const branch = await SeatService.getSeatById(customer.seat_id);
    const foods = await FoodService.getFoodByBranch(branch.branch_id);

    res.json(foods);
}