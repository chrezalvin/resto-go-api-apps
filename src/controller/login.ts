import { Request, Response } from "express";

export async function authenticate_post(req: Request, res: Response){
    const { long, lat, table_id } = req.body;

    if(typeof long !== "number" || typeof lat !== "number" || typeof table_id !== "number"){
        return res.status(400).send({error: "Invalid data"});
    }

    res.send({message: "Authenticated"});
}