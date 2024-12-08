"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchService = void 0;
const func_1 = require("../libraries/func");
const ServiceSupabase_1 = __importDefault(require("../libraries/ServiceSupabase"));
const models_1 = require("../models");
class BranchService {
    static async getBranches() {
        return await BranchService.branchManager.getAll();
    }
    static async getBranch(branch_id) {
        return await BranchService.branchManager.get(branch_id);
    }
    static async getNearestBranch(long, lat) {
        const branches = await BranchService.branchManager.getAll();
        for (const branch of branches) {
            if ((0, func_1.isWithinRadius)({ ...branch }, { lat, long }, 120)) {
                return branch;
            }
        }
        throw new Error("No branch found within 120 meters");
    }
    static async addBranch(branch) {
        return await BranchService.branchManager.add(branch);
    }
    static async updateBranch(branch_id, branch) {
        return await BranchService.branchManager.update(branch_id, branch);
    }
    static async deleteBranch(branch_id) {
        return await BranchService.branchManager.delete(branch_id);
    }
}
exports.BranchService = BranchService;
BranchService.branchPath = "branch";
BranchService.branchManager = new ServiceSupabase_1.default("branch_id", BranchService.branchPath, {
    typeGuard: models_1.isBranch,
    useCache: false,
});
