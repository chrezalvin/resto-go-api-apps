import { branch_post } from "controller/branch";
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        path: "/branch/:table_id",
        method: "post",
        accessType: "public",
        handler: branch_post
    }
];

export default routes;