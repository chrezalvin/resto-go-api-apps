import { supabase } from "@config";
import ServiceSupabase from "libraries/ServiceSupabase";
import { Branch } from "models";
import { BranchService } from "services/BranchService";
import foods from "assets/foodImg.json";
import { FoodService } from "services/FoodService";
import fs from "fs";

(async () => {
    // for(const food of foods){
    //     const blob = fs.readFileSync(`src/assets/${food.img}`);
    //     const url = await (new Blob([blob]).arrayBuffer());

    //     await FoodService.addFood(food, blob.);
    // }
})();