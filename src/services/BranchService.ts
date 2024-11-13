import { isWithinRadius } from "libraries/func";
import ServiceSupabase from "../libraries/ServiceSupabase";
import { Branch, isBranch } from "models";

export class BranchService{
    protected static readonly branchPath: string = "branch";

    static branchManager = new ServiceSupabase<Branch, "branch_id">("branch_id", BranchService.branchPath, {
        typeGuard: isBranch,
        useCache: false,
    });

    static async getBranches(){
        return await BranchService.branchManager.getAll();
    }

    static async getBranch(branch_id: number){
        return await BranchService.branchManager.get(branch_id);
    }

    static async getNearestBranch(long: number, lat: number){
        const branches = await BranchService.branchManager.getAll();

        for(const branch of branches){
            if(isWithinRadius({ ...branch }, { lat, long }, 120)){
                return branch;
            }
        }

        throw new Error("No branch found within 120 meters");
    }

    static async addBranch(branch: Omit<Branch, "branch_id">){
        return await BranchService.branchManager.add(branch);
    }

    static async updateBranch(branch_id: number, branch: Partial<Branch>){
        return await BranchService.branchManager.update(branch_id, branch);
    }

    static async deleteBranch(branch_id: number){
        return await BranchService.branchManager.delete(branch_id);
    }
}