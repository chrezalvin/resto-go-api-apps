import { RouterInterface } from "libraries/CustomTypes";
import { createTransaction, handleWebhook } from "../controller/paymentController";
import { validatePaymentInput } from "../middleware/payment";

const paymentRoutes: RouterInterface[] = [
  {
    method: "post",
    path: "/api/payments/create",
    accessType: "public",
    handler: [validatePaymentInput, createTransaction],
  },
  {
    method: "post",
    path: "/api/payments/webhook",
    accessType: "public",
    handler: [handleWebhook],
  },
  
];

export default paymentRoutes;
