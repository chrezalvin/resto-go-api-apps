import { RouterInterface } from "libraries/CustomTypes";
import { NextFunction, Request, Response } from "express";

/**
 * middleware for checking up access type of user
 * @param accessType access type of the route private by default
 */
export function checkAccessType(accessType: RouterInterface["accessType"] = "admin"){
    return (req: Request, res: Response, next: NextFunction) => {
        const customer = req.customer;

        if(customer)
            next();
        else{
            if(accessType === "public")
                next();
            else
                res.status(401).send({error: 401, message: "Unauthorized!"});
        }
    }
}