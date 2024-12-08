"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodService = void 0;
const FileManagerFirebase_1 = require("../libraries/FileManagerFirebase");
const ServiceSupabase_1 = __importDefault(require("../libraries/ServiceSupabase"));
const models_1 = require("../models");
class FoodService {
    static async translateImageUrl(food) {
        if (!food.img_path)
            await FoodService.fileManager.getUrlFromPath(food.img_path);
        return food;
    }
    static async getFoods() {
        const res = await FoodService.foodManager.getAll();
        return await Promise.all(res.map(FoodService.translateImageUrl));
    }
    static async getFoodByBranch(branch_id) {
        const res = await FoodService
            .foodManager
            .queryBuilder(query => query
            .select("*")
            .eq("branch_id", branch_id));
        if (!Array.isArray(res))
            throw new Error("Failed to get food");
        return await Promise.all(res.map(FoodService.translateImageUrl));
    }
    static async addFood(food, imgBlob) {
        const res = await FoodService.foodManager.add({ ...food, img_path: null });
        if (!res)
            throw new Error("Failed to add food");
        if (!imgBlob)
            return await FoodService.translateImageUrl(res);
        const imgRes = await FoodService.fileManager.uploadImage(imgBlob, res.food_id.toString());
        if (!imgRes)
            throw new Error("Failed to upload image");
        const uploadRes = await FoodService.foodManager.update(res.food_id, { img_path: imgRes.metadata.fullPath });
        if (!uploadRes)
            throw new Error("Failed to update food");
        return uploadRes;
    }
    static async updateFood(food_id, food, imgBlob) {
        const foodTarg = await FoodService.foodManager.get(food_id);
        if (!foodTarg)
            throw new Error("Food not found");
        const foodUpdated = await FoodService.foodManager.update(food_id, food);
        if (!foodUpdated)
            throw new Error("Failed to update food");
        if (!imgBlob)
            return await FoodService.translateImageUrl(foodUpdated);
        if (foodTarg.img_path)
            await FoodService.fileManager.deleteImage(foodTarg.img_path);
        const imgRes = await FoodService.fileManager.uploadImage(imgBlob, food_id.toString());
        if (!imgRes)
            throw new Error("Failed to upload image");
        const uploadRes = await FoodService.foodManager.update(food_id, { img_path: imgRes.metadata.fullPath });
        if (!uploadRes)
            throw new Error("Failed to update food");
        return await FoodService.translateImageUrl(uploadRes);
    }
    static async deleteFood(food_id) {
        const foodTarg = await FoodService.foodManager.get(food_id);
        if (!foodTarg)
            throw new Error("Food not found");
        if (foodTarg.img_path)
            await FoodService.fileManager.deleteImage(foodTarg.img_path);
        return await FoodService.foodManager.delete(food_id);
    }
}
exports.FoodService = FoodService;
FoodService.foodPath = "Food";
FoodService.foodImgPath = "foodImg";
FoodService.foodManager = new ServiceSupabase_1.default("food_id", FoodService.foodPath, {
    typeGuard: models_1.isFood,
    useCache: false,
});
FoodService.fileManager = new FileManagerFirebase_1.FileManagerFirebase(FoodService.foodImgPath);
