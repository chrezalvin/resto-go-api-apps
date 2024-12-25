import { transaction_get_all, transaction_get_id, transaction_post_batch } from "controller/transaction";
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        method: "post",
        path: "/transaction",
        handler: transaction_get_all,
        accessType: "admin",
    },
    {
        method: "get",
        path: "/transaction/:id",
        handler: transaction_get_id,
        accessType: "public",
    },
    {
        method: "post",
        path: "/transaction/batch",
        handler: transaction_post_batch,
        accessType: "public",
    }
]

export default routes;