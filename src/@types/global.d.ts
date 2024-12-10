import { Customer } from "models/Customer";
import { Staff } from "models/Staff";

declare global{
  namespace Express {
    interface Request {
      customer?: Customer; 
      admin?: Staff;
    }
  }
}