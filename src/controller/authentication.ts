import { Request, Response } from "express";
import { Transaction } from "models";
import { BranchService } from "services/BranchService";
import { CustomerService } from "services/CustomerService";
import { TransactionService } from "services/OrderService";
import { SeatService } from "services/SeatService";

export async function authenticate_post(req: Request, res: Response){
    const seat_id = parseInt(req.body.seat_id);
    const long = parseFloat(req.body.long);
    const lat = parseFloat(req.body.lat);

    if(isNaN(seat_id) || isNaN(long) || isNaN(lat))
        throw new Error("Invalid input data!");

    const customer = await CustomerService.authenticateCustomer(seat_id, long, lat);

    res.json(customer);
}

export async function logout_get(req: Request, res: Response){
    const customer = req.customer;

    if(!customer)
        throw new Error("Invalid customer!");

    await CustomerService.deleteCustomer(customer.customer_id);

    res.json({
        message: "success"
    });
}

export async function profile_get(req: Request, res: Response){
    const profile = req.customer;

    if(!profile)
        throw new Error("Invalid profile!");

    const seat = await SeatService.getSeatById(profile.seat_id);
    const branch = await BranchService.getBranch(seat.branch_id);

    if(!branch)
        throw new Error("Invalid branch!");

    let transaction: Transaction | null = null;
    if(profile.transaction_id)
        transaction = (await TransactionService.getTransactionById(profile.transaction_id)) ?? null;

    res.json({
        customer_id: profile.customer_id,
        branch: branch,
        transaction: transaction,
    });
}