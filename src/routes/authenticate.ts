import { profile_get, authenticate_post, logout_get } from "controller/authentication";
import { RouterInterface } from "libraries/CustomTypes";

const routes: RouterInterface[] = [
    {
        path: "/authenticate",
        method: "post",
        accessType: "public",
        handler: authenticate_post
    },
    {
        path: "/profile",
        method: "get",
        accessType: "customer",
        handler: profile_get
    },
    {
        path: "/logout",
        method: "get",
        accessType: "customer",
        handler: logout_get
    }
];

export default routes;