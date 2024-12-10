"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCheck = sessionCheck;
const debug = require("debug")("Server:customerCheck");
const CustomerService_1 = require("../services/CustomerService");
function sessionCheck() {
    return async (req, res, next) => {
        // check if session is set
        const sessionid = req.headers.customer_id;
        if (!sessionid)
            debug("no sessionid found");
        else
            debug(`sessionid found: ${sessionid}`);
        try {
            if (typeof sessionid === "string")
                req.customer = await CustomerService_1.CustomerService.getCustomerById(sessionid);
            next();
        }
        catch (err) {
            res.status(401).send({ error: 401, message: "Unknown error" });
        }
    };
}
