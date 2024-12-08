"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const food_1 = require("../controller/food");
const routes = [
    {
        path: "/food",
        method: "get",
        accessType: "customer",
        handler: food_1.food_get
    }
];
exports.default = routes;
