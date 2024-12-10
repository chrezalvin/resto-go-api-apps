import ServiceSupabase from "libraries/ServiceSupabase";
import { Admin, isAdmin } from "models";

async function sha256(message: string): Promise<string> {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export class AdminService{
    protected static readonly adminPath: string = "admin";

    static adminManager = new ServiceSupabase<Admin, "admin_id">("admin_id", AdminService.adminPath, {
        typeGuard: isAdmin,
        useCache: false,
    });

    static async loginAdmin(username: string, password: string): Promise<Admin>{
        const hashedPassword = await sha256(password);

        const res = await AdminService
            .adminManager
            .queryBuilder(query => query
                .select("*")
                .eq("username", username)
                .eq("password", hashedPassword)
                .limit(1)
                .single()
            );

        if(Array.isArray(res))
            throw new Error("Invalid username or password");

        return res;
    }
}