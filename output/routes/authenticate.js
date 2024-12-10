"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controller/authentication");
const routes = [
    {
        path: "/authenticate",
        method: "post",
        accessType: "public",
        handler: authentication_1.authenticate_post
    },
    {
        path: "/profile",
        method: "get",
        accessType: "customer",
        handler: authentication_1.profile_get
    },
    {
        path: "/logout",
        method: "get",
        accessType: "customer",
        handler: authentication_1.logout_get
    }
];
exports.default = routes;
