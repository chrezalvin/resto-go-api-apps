import { payment_cash_confirm_post, payment_checkout_post, payment_create_post, payment_customer_get } from 'controller/payment';
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        method: "post",
        path: "/payment/qris/create",
        accessType: "customer",
        handler: payment_create_post,
    },
    {
        method: "post",
        path: "/payment/cash/confirm",
        accessType: "public",
        handler: payment_cash_confirm_post,
    },
    {
        method: "get",
        path: "/payment/me",
        accessType: "customer",
        handler: payment_customer_get,
    },
    {
        method: "get",
        path: "/transaction/:transaction_id/finalize",
        accessType: "public",
        handler: payment_customer_get,
    },
    {
        method: "post",
        path: "/transaction/checkout",
        accessType: "customer",
        handler: payment_checkout_post,
    }
];

export default routes;