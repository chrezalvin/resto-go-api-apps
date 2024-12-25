import ServiceSupabase from "../libraries/ServiceSupabase";
import { CustomerView, isCustomerView } from "models/CustomerView";

export class CustomerViewService{
    protected static readonly customerViewPath: string = "customerview";

    static branchManager = new ServiceSupabase<CustomerView, "customer_id">("customer_id", CustomerViewService.customerViewPath, {
        typeGuard: isCustomerView,
        useCache: false,
    });

    static async getCustomerViews(){
        return await CustomerViewService.branchManager.getAll();
    }

    static async getCustomerView(customer_id: CustomerView["customer_id"]){
        return await CustomerViewService.branchManager.get(customer_id);
    }

    static async getCustomerViewByBranch(branch_id: number){
        const res = await CustomerViewService
            .branchManager
            .queryBuilder(query => query
                .select("*")
                .eq("branch_id", branch_id)
        );

        if(!Array.isArray(res))
            throw new Error("Failed to get customer view");

        return res;
    }

    static async getCustomerViewBySeat(seat_id: number): Promise<CustomerView>{
        const res = await CustomerViewService
            .branchManager
            .queryBuilder(query => query
                .select("*")
                .eq("seat_id", seat_id)
                .limit(1)
                .single()
        );

        if(Array.isArray(res))
            throw new Error("Failed to get customer view");

        return res;
    }

    static async getCustomerViewByTransaction(transaction_id: number){
        const res = await CustomerViewService
            .branchManager
            .queryBuilder(query => query
                .select("*")
                .eq("transaction_id", transaction_id)
        );

        if(!Array.isArray(res))
            throw new Error("Failed to get customer view");

        return res;
    }
}