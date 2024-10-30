import { FileManagerFirebase } from "libraries/FileManagerFirebase";
import ServiceSupabase from "libraries/ServiceSupabase";
import { Food, isFood } from "models";

export class FoodService{
    protected static readonly foodPath: string = "food";

    static foodManager = new ServiceSupabase<Food, "food_id">("food_id", FoodService.foodPath, {
        typeGuard: isFood,
        useCache: false,
    });

    static fileManager = new FileManagerFirebase("food_img");

    static async translateImageUrl(food: Food){
        food.img_url = await FoodService.fileManager.getUrlFromPath(food.img_url);

        return food;
    }

    static async getFoods(){
        const res = await FoodService.foodManager.getAll();

        return await Promise.all(res.map(FoodService.translateImageUrl));
    }
}