import { Request, Response } from "express";
import { BranchService } from "services/BranchService";

export async function branch_get_all(_: Request, res: Response){
    const branches = await BranchService.getBranches();

    res.json(branches);
}

export async function branch_get_by_id(req: Request, res: Response){
    const branch_id = parseInt(req.params.branch_id);
    const branch = await BranchService.getBranch(branch_id);

    res.json(branch);
}