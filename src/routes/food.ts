import { food_get } from "controller/food";
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        path: "/food",
        method: "get",
        accessType: "customer",
        handler: food_get
    }
];

export default routes;