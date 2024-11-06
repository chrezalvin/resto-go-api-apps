import { FileManagerFirebase } from "libraries/FileManagerFirebase";
import ServiceSupabase from "libraries/ServiceSupabase";
import { Food, isFood } from "models";

export class FoodService{
    protected static readonly foodPath: string = "food";
    protected static readonly foodImgPath: string = "food_img";

    static foodManager = new ServiceSupabase<Food, "food_id">("food_id", FoodService.foodPath, {
        typeGuard: isFood,
        useCache: false,
    });

    static fileManager = new FileManagerFirebase(FoodService.foodImgPath);

    static async translateImageUrl(food: Food){

        if(!food.img_path)
            await FoodService.fileManager.getUrlFromPath(food.img_path!);

        return food;
    }

    static async getFoods(){
        const res = await FoodService.foodManager.getAll();

        return await Promise.all(res.map(FoodService.translateImageUrl));
    }

    static async addFood(food: Omit<Food, "food_id">, imgUrlOrBuffer: string | ArrayBuffer): Promise<Food>{
        const res = await FoodService.foodManager.add({img_path: undefined, ...food});

        if(!res)
            throw new Error("Failed to add food");

        
        const imgRes = await FoodService.fileManager.uploadImage(imgUrl, res.food_id.toString());

        if(!imgRes)
            throw new Error("Failed to upload image");

        const uploadRes = await FoodService.foodManager.update(res.food_id, {img_path: imgRes.metadata.fullPath});

        if(!uploadRes)
            throw new Error("Failed to update food");

        return uploadRes;
    }
}