const debug = require("debug")("Server:customerCheck");

import { NextFunction, RequestHandler, Request, Response } from "express";
import { CustomerService } from "services/CustomerService";

export function sessionCheck(): RequestHandler{
    return async (req: Request, res: Response, next: NextFunction) => {    
        // check if session is set
        const sessionid = req.headers.customer_id as unknown;

        if(!sessionid)
            debug("no sessionid found");
        else
            debug(`sessionid found: ${sessionid}`);

        try{
            if(typeof sessionid === "string")
                req.customer = await CustomerService.getCustomerById(sessionid);

            if(sessionid){
                
            }

            next();
        }
        catch(err){
            res.status(401).send({error: 401, message: "Unknown error"});
        }
    }
}