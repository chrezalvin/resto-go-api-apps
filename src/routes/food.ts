import { branch_post } from "controller/branch";
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        path: "/food",
        method: "get",
        accessType: "public",
        handler: (req, res) => {
            res.send("hello world");
        }
    }
];

export default routes;