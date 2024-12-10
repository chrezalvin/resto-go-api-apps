"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const branch_1 = require("../controller/branch");
const routes = [
    {
        path: "/branch/all",
        method: "get",
        accessType: "public",
        handler: branch_1.branch_get_all
    },
    {
        path: "/branch/:table_id",
        method: "post",
        accessType: "public",
        handler: branch_1.branch_get_by_id
    }
];
exports.default = routes;
