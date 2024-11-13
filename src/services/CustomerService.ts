import ServiceSupabase from "libraries/ServiceSupabase";
import { Customer, isCustomer } from "models";
import { BranchService } from "./BranchService";
import { SeatService } from "./SeatService";

export class CustomerService{
    protected static readonly customerPath: string = "Customer";
    static customerManager = new ServiceSupabase<Customer, "customer_id">("customer_id", CustomerService.customerPath, {
        typeGuard: isCustomer,
        useCache: false,
    });

    static async authenticateCustomer(seat_id: Customer["seat_id"], long: number, lat: number): Promise<Customer>{
        // check if seat is available and user is within the branch
        const nearestBranch = await BranchService.getNearestBranch(long, lat);
        const seat = await SeatService.getSeatById(seat_id);

        if(nearestBranch.branch_id !== seat.branch_id)
            throw new Error("Invalid branch!");

        const customer = await CustomerService.customerManager.add({
            seat_id,
            transaction_id: null
        });

        if(!customer)
            throw new Error("The seat have been taken!");

        return customer;
    }

    static async getCustomers(){
        return await CustomerService.customerManager.getAll();
    }

    static async getCustomerById(customer_id: Customer["customer_id"]){
        return await CustomerService.customerManager.get(customer_id);
    }

    static async addCustomer(customer: Omit<Customer, "customer_id">){
        return await CustomerService.customerManager.add(customer);
    }

    static async updateCustomer(customer_id: Customer["customer_id"], customer: Partial<Omit<Customer, "customer_id">>){
        return await CustomerService.customerManager.update(customer_id, customer);
    }

    static async deleteCustomer(customer_id: Customer["customer_id"]){
        return await CustomerService.customerManager.delete(customer_id);
    }
}