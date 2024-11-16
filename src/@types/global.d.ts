import { Customer } from "models/Customer";

declare global{
  namespace Express {
    interface Request {
      customer?: Customer; 
    }
  }
}