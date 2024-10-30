import { supabase } from "@config";
import ServiceSupabase from "libraries/ServiceSupabase";
import { Branch } from "models";
import { BranchService } from "services/BranchService";

(async () => {
    console.log("Finding branches...");

    const branches = await BranchService.getBranches();
    console.log(branches);

    console.log("Finding branch...");
})();