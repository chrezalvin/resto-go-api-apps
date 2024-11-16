import { Request, Response } from 'express';

export async function transaction_create(req: Request, res: Response){
    const food_ids = req.body.food_ids;

    if(!Array.isArray(food_ids))
        throw new Error("Invalid input data!");
}