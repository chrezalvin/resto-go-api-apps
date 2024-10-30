import { supabase } from "@config";
import { randomUUID } from "crypto";

export class FileManagerSupabase{
    public static s_fileManagers: FileManagerSupabase[] = [];

    protected m_bucket: string;
    protected m_path: string;
    protected m_cache: string[] = [];

    constructor(bucket: string, path: string){
        this.m_bucket = bucket;
        this.m_path = path;

        this.getAllFiles();
        FileManagerSupabase.s_fileManagers.push(this);
    }

    // getters
    /**
     * the url of all the files in the storage
     */
    get cache(){ return this.m_cache.map((path) => this.translateToUrl(path)); }

    /**
     * the path of the storage
     */
    get path(){ return this.m_path; }

    /**
     * the bucket of the storage
     */
    get bucket(){ return this.m_bucket; }

    /**
     * the length of the cache
     */
    get length(){ return this.m_cache.length; }

    translateToUrl(fileName: string): string{
        return supabase.storage.from(this.m_bucket).getPublicUrl(`${this.m_path}/${fileName}`).data.publicUrl;
    }
    
    /**
     * get a file url based on the index
     * @param index the index of the file
     */
    get(index: number): string{
        return this.translateToUrl(this.m_cache[index]);
    }

    /**
     * find a file based on the filename
     * @param filename the filename to search
     */
    async find(filename: string): Promise<string | undefined>{
        const found = this.m_cache.find((file) => file === filename);

        return found ? this.translateToUrl(found) : undefined;
    }

    /**
     * upload an image to the storage, if filename is not provided, it will generate a random filename based on uuid
     */
    async uploadImage(imgUrl: string, filename?: string): Promise<string>{
        // fetch the file
        const res = await fetch(imgUrl);
        const blob = await res.blob();

        const fileExtension = blob.type.split("/")[1];

        const uploadFileRes = await supabase
            .storage
            .from(this.m_bucket)
            .upload(`${this.m_path}/${filename ?? randomUUID()}.${fileExtension}`, blob);

        if(uploadFileRes.error)
            throw new Error(uploadFileRes.error.message);

        const fileName = uploadFileRes.data.path.split("/").pop() ?? "unknown";

        this.m_cache.push(`${fileName}.${fileExtension}`);

        return fileName;
    }

    /**
     * delete an image from the storage
     * @param fileName the filename to delete
     */
    async deleteImage(fileName: string): Promise<void>{
        const deleteRes = await supabase
            .storage
            .from(this.m_bucket)
            .remove([`${this.m_path}/${fileName}`]);

        if(deleteRes.error)
            throw new Error(deleteRes.error.message);

        this.m_cache = this.m_cache.filter((file) => file !== fileName);
    }

    /**
     * get all files in the storage in url format
     */
    async getAllFiles(){
        const allFiles = await supabase.storage.from(this.m_bucket).list(this.m_path);

        this.m_cache = allFiles.data?.map((file) => file.name) ?? [];

        return this.m_cache.map(path => this.translateToUrl(path));
    }
}

export default FileManagerSupabase;