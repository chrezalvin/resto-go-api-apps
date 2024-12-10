"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManagerFirebase = void 0;
const debug = require("debug")("Server:FileManager");
const _config_1 = require("../serverConfig");
const storage_1 = require("firebase/storage");
const crypto_1 = require("crypto");
/**
 * @deprecated
 */
class FileManagerFirebase {
    constructor(imgPath) {
        this.m_cache = [];
        this.m_imgPath = imgPath;
        // fills cache when instanitized, no need to await
        this.getAllFiles();
        // load the instance to the static array
        FileManagerFirebase.s_filemanagers.push(this);
    }
    // getter
    /**
     * the cache of the entire imgPath
     */
    get cache() {
        return this.m_cache;
    }
    async translateToUrl(fileName) {
        return await (0, storage_1.getDownloadURL)((0, storage_1.ref)(FileManagerFirebase.storage, `${this.m_imgPath}/${fileName}`));
    }
    // private async base functions to only get data from database
    /**
     * get all files in the folder
     * @returns list of data (might be limited per page)
     */
    async _getAllFiles() {
        const imgRef = (0, storage_1.ref)(FileManagerFirebase.storage, this.m_imgPath);
        const list = await (0, storage_1.listAll)(imgRef);
        return list.items;
    }
    /**
     * Uploads an image to the database, this function will only accept the extension that is in the acceptedBlobTypes
     * @param imgUrl url of the image to be uploaded
     * @param filename the file name of the image that will be stored in the database (without extension) if not set, it will generate an uuid
     * @returns UploadResult
     */
    async _uploadImage(urlOrBlob, filename) {
        // fetcha and test if the data is a valid image
        let blob;
        if (typeof urlOrBlob === "string") {
            const res = await fetch(urlOrBlob);
            blob = await res.blob();
        }
        else {
            blob = urlOrBlob;
        }
        const fileExtension = blob.type.split("/")[1];
        if (!FileManagerFirebase.acceptedBlobTypes.includes(blob.type))
            throw new Error("Invalid image file!");
        const imgRef = (0, storage_1.ref)(FileManagerFirebase.storage, `${this.m_imgPath}/${filename ?? (0, crypto_1.randomUUID)()}.${fileExtension}`);
        const uploadRes = await (0, storage_1.uploadBytes)(imgRef, blob);
        return uploadRes;
    }
    /**
     * deletes an image in the firebase storage
     * @param imgName the name of the image to be deleted
     */
    async _deleteImage(imgName) {
        const storageRef = (0, storage_1.ref)(FileManagerFirebase.storage, `${this.m_imgPath}/${imgName}`);
        await (0, storage_1.deleteObject)(storageRef);
    }
    /**
     * replaces the image in the database with a new image without changing the filename in the database
     * @param imgUrl the new image url
     * @param filename the filename of the image
     * @returns UploadResult
     */
    async _replaceImage(imgUrl, filename) {
        await this._deleteImage(filename);
        return await this._uploadImage(imgUrl, filename);
    }
    /**
     * get the download url of an image from the path
     * @param path the path of the image
     * @returns the download url of the image
     */
    async _getUrlFromPath(path) {
        const imgRef = (0, storage_1.ref)(FileManagerFirebase.storage, path);
        const imgUrl = await (0, storage_1.getDownloadURL)(imgRef);
        return imgUrl;
    }
    // public accessible functions that wraps the base functions
    async getAllFiles() {
        debug(`getting all files in ${this.m_imgPath}`);
        const allFiles = await this._getAllFiles();
        this.m_cache = allFiles;
        return allFiles;
    }
    async uploadImage(imgUrlOrBlob, filename) {
        debug(`Uploading ${filename ?? "unknown filename"}`);
        const res = await this._uploadImage(imgUrlOrBlob, filename);
        return res;
    }
    async deleteImage(imgName) {
        debug(`Deleting ${imgName}`);
        await this._deleteImage(imgName);
    }
    async replaceImage(imgUrl, filename) {
        debug(`Replacing ${filename}`);
        return await this._replaceImage(imgUrl, filename);
    }
    async getUrlFromPath(path) {
        debug(`Getting url from ${path}`);
        return await this._getUrlFromPath(path);
    }
}
exports.FileManagerFirebase = FileManagerFirebase;
// map all FileManagers
FileManagerFirebase.s_filemanagers = [];
FileManagerFirebase.acceptedBlobTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
FileManagerFirebase.storage = (0, storage_1.getStorage)(_config_1.firebaseApp);
