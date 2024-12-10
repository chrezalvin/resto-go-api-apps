import { Branch, isBranch } from "./Branch";
import { Customer, isCustomer } from "./Customer";
import { isSeat, Seat } from "./Seat";

export interface CustomerView extends Customer, Seat, Branch{

}

export function isCustomerView(value: unknown): value is CustomerView{
    if(!isCustomer(value))
        return false;

    if(!isSeat(value))
        return false;

    if(!isBranch(value))
        return false;

    return true;
}