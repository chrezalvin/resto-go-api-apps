"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const ServiceSupabase_1 = __importDefault(require("../libraries/ServiceSupabase"));
const models_1 = require("../models");
const BranchService_1 = require("./BranchService");
const SeatService_1 = require("./SeatService");
class CustomerService {
    static async authenticateCustomer(seat_id, long, lat) {
        // check if seat is available and user is within the branch
        const nearestBranch = await BranchService_1.BranchService.getNearestBranch(long, lat);
        const seat = await SeatService_1.SeatService.getSeatById(seat_id);
        if (nearestBranch.branch_id !== seat.branch_id)
            throw new Error("Invalid branch!");
        const customer = await CustomerService.customerManager.add({
            seat_id,
            transaction_id: null
        });
        if (!customer)
            throw new Error("The seat have been taken!");
        return customer;
    }
    static async getCustomers() {
        return await CustomerService.customerManager.getAll();
    }
    static async getCustomerById(customer_id) {
        return await CustomerService.customerManager.get(customer_id);
    }
    static async addCustomer(customer) {
        return await CustomerService.customerManager.add(customer);
    }
    static async updateCustomer(customer_id, customer) {
        return await CustomerService.customerManager.update(customer_id, customer);
    }
    static async deleteCustomer(customer_id) {
        return await CustomerService.customerManager.delete(customer_id);
    }
}
exports.CustomerService = CustomerService;
CustomerService.customerPath = "Customer";
CustomerService.customerManager = new ServiceSupabase_1.default("customer_id", CustomerService.customerPath, {
    typeGuard: models_1.isCustomer,
    useCache: false,
});
