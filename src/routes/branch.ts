import { branch_get_all, branch_get_by_id } from "controller/branch";
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        path: "/branch/all",
        method: "get",
        accessType: "admin",
        handler: branch_get_all
    },
    {
        path: "/branch/:table_id",
        method: "post",
        accessType: "admin",
        handler: branch_get_by_id
    }
];

export default routes;