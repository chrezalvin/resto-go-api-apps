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

export async function food_branch_get(req: Request, res: Response){
    const branch_id = parseInt(req.params.branch_id);

    if(isNaN(branch_id))
        throw new Error("Invalid input data!");

    const foods = await FoodService.getFoodByBranch(branch_id);

    res.json(foods);
}