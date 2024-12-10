"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branch_get_all = branch_get_all;
exports.branch_get_by_id = branch_get_by_id;
const BranchService_1 = require("../services/BranchService");
async function branch_get_all(_, res) {
    const branches = await BranchService_1.BranchService.getBranches();
    res.json(branches);
}
async function branch_get_by_id(req, res) {
    const branch_id = parseInt(req.params.branch_id);
    const branch = await BranchService_1.BranchService.getBranch(branch_id);
    res.json(branch);
}
