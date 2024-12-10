import { RouterInterface } from "libraries/CustomTypes";
import { createTransaction } from "../controller/paymentController";
import { validatePaymentInput } from "../middleware/payment";

const paymentRoutes: RouterInterface[] = [
  {
    method: "post",
    path: "/api/payments/create",
    accessType: "public",
    handler: [validatePaymentInput, createTransaction], // Validasi input dan buat transaksi.
  },
];

export default paymentRoutes;
