import { food_branch_get, food_get } from "controller/food";
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        path: "/food",
        method: "get",
        accessType: "customer",
        handler: food_get
    },
    {
        path: "/food/branch/:branch_id",
        method: "get",
        accessType: "public",
        handler: food_branch_get,
    }
];

export default routes;