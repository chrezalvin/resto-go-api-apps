import { NextFunction, RequestHandler, Request, Response } from "express";

export interface RouterInterface{
    path: string;
    handler: RequestHandler | RequestHandler[];

    // handler: ((req: Request, res: Response, next: NextFunction) => Promise<void> | ((req: Request, res: Response) => Promise<void>));
    // handler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    // handler: ((req: Request, res: Response, next: NextFunction) => Promise<void>) | ((req: Request, res: Response) => Promise<void>);
    method: "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "connect" | "trace";
    accessType?: "public" | "admin" | "customer";
}

export interface I_Cause{
    readonly ok: boolean;
    readonly message: string;
}

/**
 * return type for functions that can return error
 */
export class Cause implements I_Cause{
    readonly ok: boolean;
    readonly message: string;

    static isCause(val: unknown): val is Cause{
        if(typeof val === "object" && val !== null)
            if("ok" in val)
                if("message" in val)
                    return typeof val.ok === "boolean" && typeof val.message === "string";

        return false;
    }

    constructor(ok: boolean = true, message: string = ""){
        this.ok = ok;
        this.message = message;
    }
}

/**
 * modifier type to modify the type to be non nullable
 */
export type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};
