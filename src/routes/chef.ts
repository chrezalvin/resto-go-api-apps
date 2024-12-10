import { branch_get_all, branch_get_by_id } from "controller/branch";
import { transaction_finalize_get } from "controller/chef";
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        path: "/chef/transaction/branch/:branch_id",
        method: "get",
        accessType: "admin",
        handler: branch_get_all
    },
    {
        method: "get",
        path: "/chef/transaction/finallize",
        accessType: "admin",
        handler: transaction_finalize_get,
    },
];

export default routes;