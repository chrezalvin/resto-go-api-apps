"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccessType = checkAccessType;
/**
 * middleware for checking up access type of user
 * @param accessType access type of the route private by default
 */
function checkAccessType(accessType = "admin") {
    return (req, res, next) => {
        const customer = req.customer;
        if (customer)
            next();
        else {
            if (accessType === "public")
                next();
            else
                res.status(401).send({ error: 401, message: "Unauthorized!" });
        }
    };
}
