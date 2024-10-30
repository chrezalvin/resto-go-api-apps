import { Request, Response } from "express";
import { BranchService } from "services/BranchService";
import { SeatService } from "services/SeatService";

export async function branch_post(req: Request, res: Response){
    const tableId = parseInt(req.params.table_id);
    const {long, lat} = req.body;

    if(isNaN(tableId)){
        throw new Error("Invalid data");
    }

    if(typeof long !== "number" || typeof lat !== "number"){
        throw new Error("Invalid data");
    }

    const branch = await BranchService.getNearestBranch(long, lat);
    const seat = await SeatService.getSeat(tableId, branch.branch_id);

    if(seat.available){
        await SeatService.setSeatAvailability(tableId, false);

        return res.status(200).send(branch);
    }
    else
        throw new Error("Seat is not available");
}