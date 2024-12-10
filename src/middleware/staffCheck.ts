const debug = require("debug")("Server:customerCheck");

import { NextFunction, RequestHandler, Request, Response } from "express";
import {Jwt, verify} from "jsonwebtoken";
import { JWT_SECRET } from "@config";
import { StaffService } from "services/StaffService";

export function staffCheck(): RequestHandler{
    return async (req: Request, res: Response, next: NextFunction) => {    
        // check if session is set
        const authorization = req.headers.authorization as unknown;

        if(!authorization)
            debug("authorization not found");
        else
            debug(`authorization found: ${authorization}, uses auth instead`);

        try{
            if(typeof authorization === "string"){
                const decoded = verify(authorization, JWT_SECRET, {
                    algorithms: ["HS256"]
                });

                if(typeof decoded === "string")
                    return res.status(401).json({error: 401, message: "Invalid token"});
                else{
                    if("id" in decoded && typeof decoded.id === "number"){
                        req.admin = await StaffService.getStaff(decoded.id);

                        console.log(`Admin found: ${JSON.stringify(req.admin)}`);
                    }
                }
            }

            next();
        }
        catch(err){
            res.status(401).send({error: 401, message: "Unknown error"});
        }
    }
}