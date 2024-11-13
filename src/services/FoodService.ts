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

    static async translateImageUrl(food: Food): Promise<Food>{

        if(!food.img_path)
            await FoodService.fileManager.getUrlFromPath(food.img_path!);

        return food;
    }

    static async getFoods(){
        const res = await FoodService.foodManager.getAll();

        return await Promise.all(res.map(FoodService.translateImageUrl));
    }

    static async getFoodByBranch(branch_id: number): Promise<Food[]>{
        const res = await FoodService
            .foodManager
            .queryBuilder(query => query
                .select("*")
                .eq("branch_id", branch_id)
        );

        if(!Array.isArray(res))
            throw new Error("Failed to get food");

        return await Promise.all(res.map(FoodService.translateImageUrl));
    }

    static async addFood(food: Omit<Food, "food_id" | "img_path">, imgBlob?: Blob): Promise<Food>{
        const res = await FoodService.foodManager.add({...food, img_path: undefined});

        if(!res)
            throw new Error("Failed to add food");

        if(!imgBlob)
            return await FoodService.translateImageUrl(res);

        const imgRes = await FoodService.fileManager.uploadImage(imgBlob, res.food_id.toString());

        if(!imgRes)
            throw new Error("Failed to upload image");

        const uploadRes = await FoodService.foodManager.update(res.food_id, {img_path: imgRes.metadata.fullPath});

        if(!uploadRes)
            throw new Error("Failed to update food");

        return uploadRes;
    }

    static async updateFood(food_id: number, food: Partial<Omit<Food, "food_id" | "img_path">>, imgBlob?: Blob): Promise<Food>{
        const foodTarg = await FoodService.foodManager.get(food_id);
        
        if(!foodTarg)
            throw new Error("Food not found");

        const foodUpdated = await FoodService.foodManager.update(food_id, food);

        if(!foodUpdated)
            throw new Error("Failed to update food");

        if(!imgBlob)
            return await FoodService.translateImageUrl(foodUpdated);

        if(foodTarg.img_path)
            await FoodService.fileManager.deleteImage(foodTarg.img_path);
    
        const imgRes = await FoodService.fileManager.uploadImage(imgBlob, food_id.toString());

        if(!imgRes)
            throw new Error("Failed to upload image");

        const uploadRes = await FoodService.foodManager.update(food_id, {img_path: imgRes.metadata.fullPath});

        if(!uploadRes)
            throw new Error("Failed to update food");

        return await FoodService.translateImageUrl(uploadRes);
    }

    static async deleteFood(food_id: number){
        const foodTarg = await FoodService.foodManager.get(food_id);

        if(!foodTarg)
            throw new Error("Food not found");

        if(foodTarg.img_path)
            await FoodService.fileManager.deleteImage(foodTarg.img_path);

        return await FoodService.foodManager.delete(food_id);
    }
}