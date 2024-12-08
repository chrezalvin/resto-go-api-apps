import { payment_create_post, payment_customer_get } from 'controller/payment';
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
        accessType: "admin",
        handler: () => {},
    },
    {
        method: "get",
        path: "/payment/me",
        accessType: "customer",
        handler: payment_customer_get,
    },
];

export default routes;