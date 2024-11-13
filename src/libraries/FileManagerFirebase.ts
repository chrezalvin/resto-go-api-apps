const debug = require("debug")("Server:FileManager");

import { firebaseApp } from "@config";
import { getStorage, UploadResult, uploadBytes, deleteObject, getDownloadURL, listAll, ref, StorageReference } from "firebase/storage";
import { randomUUID } from "crypto";

/**
 * @deprecated
 */
export class FileManagerFirebase{
    // map all FileManagers
    public static s_filemanagers: FileManagerFirebase[] = [];

    protected static readonly acceptedBlobTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    protected static storage = getStorage(firebaseApp);

    protected m_imgPath: string;
    protected m_cache: StorageReference[] = [];

    constructor(imgPath: string){
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
    get cache(): StorageReference[]{
        return this.m_cache;
    }

    public async translateToUrl(fileName: string): Promise<string>{
        return await getDownloadURL(ref(FileManagerFirebase.storage, `${this.m_imgPath}/${fileName}`));
    }

    // private async base functions to only get data from database
    /**
     * get all files in the folder
     * @returns list of data (might be limited per page)
     */
    protected async _getAllFiles(){
        const imgRef = ref(FileManagerFirebase.storage, this.m_imgPath);
        const list = await listAll(imgRef);
        
        return list.items;
    }

    /**
     * Uploads an image to the database, this function will only accept the extension that is in the acceptedBlobTypes
     * @param imgUrl url of the image to be uploaded
     * @param filename the file name of the image that will be stored in the database (without extension) if not set, it will generate an uuid
     * @returns UploadResult
     */
    protected async _uploadImage(urlOrBlob: string | Blob, filename?: string): Promise<UploadResult>{
        // fetcha and test if the data is a valid image

        let blob: Blob;

        if(typeof urlOrBlob === "string"){
            const res = await fetch(urlOrBlob);
            blob = await res.blob();
        }
        else{
            blob = urlOrBlob;
        }
        
        const fileExtension = blob.type.split("/")[1];

        if(!FileManagerFirebase.acceptedBlobTypes.includes(blob.type))
            throw new Error("Invalid image file!");

        const imgRef = ref(FileManagerFirebase.storage, `${this.m_imgPath}/${filename ?? randomUUID()}.${fileExtension}`);
        const uploadRes = await uploadBytes(imgRef, blob);

        return uploadRes;
    }

    /**
     * deletes an image in the firebase storage
     * @param imgName the name of the image to be deleted
     */
    protected async _deleteImage(imgName: string): Promise<void>{
        const storageRef = ref(FileManagerFirebase.storage, `${this.m_imgPath}/${imgName}`);
        await deleteObject(storageRef);
    }

    /**
     * replaces the image in the database with a new image without changing the filename in the database
     * @param imgUrl the new image url
     * @param filename the filename of the image
     * @returns UploadResult
     */
    protected async _replaceImage(imgUrl: string, filename: string): Promise<UploadResult>{
        await this._deleteImage(filename);
        return await this._uploadImage(imgUrl, filename);
    }

    /**
     * get the download url of an image from the path
     * @param path the path of the image
     * @returns the download url of the image
     */
    protected async _getUrlFromPath(path: string): Promise<string>{
        const imgRef = ref(FileManagerFirebase.storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        return imgUrl;
    }

    // public accessible functions that wraps the base functions
    public async getAllFiles(): Promise<StorageReference[]>{
        debug(`getting all files in ${this.m_imgPath}`);

        const allFiles = await this._getAllFiles();
        this.m_cache = allFiles;

        return allFiles;
    }

    public async uploadImage(imgUrlOrBlob: string | Blob, filename?: string): Promise<UploadResult | null>{
        debug(`Uploading ${filename ?? "unknown filename"}`);
        
        const res = await this._uploadImage(imgUrlOrBlob, filename);
        return res;
    }

    public async deleteImage(imgName: string): Promise<void>{
        debug(`Deleting ${imgName}`);

        await this._deleteImage(imgName);
    }

    public async replaceImage(imgUrl: string, filename: string): Promise<UploadResult>{
        debug(`Replacing ${filename}`);

        return await this._replaceImage(imgUrl, filename);
    }

    public async getUrlFromPath(path: string): Promise<string>{
        debug(`Getting url from ${path}`);

        return await this._getUrlFromPath(path);
    }
}