import { transaction_finalize_get, chef_food_branch_get } from "controller/chef";
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        path: "/chef/transaction/branch/:branch_id",
        method: "get",
        accessType: "admin",
        handler: chef_food_branch_get
    },
    {
        method: "get",
        path: "/chef/transaction/finallize/:transaction_id",
        accessType: "admin",
        handler: transaction_finalize_get,
    },
];

export default routes;