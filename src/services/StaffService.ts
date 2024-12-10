import { isStaff, Staff } from "models/Staff";
import ServiceSupabase from "../libraries/ServiceSupabase";

export class StaffService{
    protected static readonly staffPath: string = "Staff";

    static branchManager = new ServiceSupabase<Staff, "staff_id">("staff_id", StaffService.staffPath, {
        typeGuard: isStaff,
        useCache: false,
    });

    static async getStaffs(){
        return await StaffService.branchManager.getAll();
    }

    static async getStaff(staff_id: Staff["staff_id"]){
        return await StaffService.branchManager.get(staff_id);
    }
}