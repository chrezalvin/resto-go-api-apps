const debug = require("debug")("Server:ServiceFirebase");

import { firebaseApp } from "@config";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, writeBatch } from "firebase/firestore/lite";

/**
 * Service class to handle the database operation, this class will cache the data to reduce the payload
 * @deprecated
 */
export class ServiceFirebase<T extends { [x: string]: any; }>{
    public static s_services: ServiceFirebase<any>[] = [];

    protected static db = getFirestore(firebaseApp);

    protected m_cache: Map<string, T> = new Map();
    protected m_dbName: string;

    protected m_typeGuard?: (obj: unknown) => obj is T;

    constructor(settings: {
        dbName: string, 
        typeGuard?: (obj: unknown) => obj is T,
    }){
        this.m_typeGuard = settings.typeGuard;
        this.m_dbName = settings.dbName;

        // fills the cache when created
        this.getAllData(true);

        // put the instance into the static array
        ServiceFirebase.s_services.push(this);
    }

    // getter
    /**
     * database name
     */
    get dbName(): string { return this.m_dbName; }

    /**
     * the cached data
     */
    get cache(): Map<string, T> { return this.m_cache; }

    /**
     * the cached data in array format
     */
    get arrayCache(): {id: string, data: T}[]{
        return Array.from(this.m_cache).map(([id, data]) => ({id, data}));
    }

    /**
     * find the data based on pred, this function will only search the data within the cache
     * @param pred the search function
     * @returns data that matches the pred
     */
    find(pred: (val: T) => boolean): {id: string, data: T}[] { 
        const res = [];
        for(const [id, data] of this.m_cache)
            if(pred(data))
                res.push({id, data});
        return res;
    }

    /**
     * find the first data that match based on pred, this function will only search the data within the cache
     * @param pred the search function
     * @returns first data that matches the pred
     */
    findFirst(pred: (val: T) => boolean): {id: string, data: T} | null{ 
        for(const [id, data]  of this.m_cache)
            if(pred(data))
                return {id, data};
        return null;
    }


    // private async base functions to only get data from database
    /**
     * get the data from the database based on the id
     * @param id the id to search
     * @returns the data that matches the id or null if not found
     */
    protected async _getById(id: string): Promise<T | null>{
        const docRef = doc(ServiceFirebase.db, this.m_dbName, id);
        const docSnapshot = await getDoc(docRef);

        if(docSnapshot.exists()){
            const data = docSnapshot.data();
            if(this.m_typeGuard){
                if(this.m_typeGuard(data)){
                    this.m_cache.set(id, data);
                    return data;   
                }
            }
            else
                return data as T;
        }

        return null;
    }

    /**
     * get all data from the database
     * @returns all data from the database or null if not found
     */
    protected async _getAllData(): Promise<Map<string, T> | null>{
        const q = query(collection(ServiceFirebase.db, this.m_dbName));

        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty){
            const queryData = querySnapshot.docs;

            const map = new Map<string, T>();
            // if typeguard isn't set, assumes that the type is already Map<string, T>
            if(this.m_typeGuard)
                queryData
                    .filter(doc => this.m_typeGuard!(doc.data()))
                    .forEach(doc => map.set(doc.id, doc.data() as T));
            else
                queryData
                    .forEach(doc => map.set(doc.id, doc.data() as T));

            return map;
        }

        return null;
    }

    /**
     * updates the data based on id to the database
     * @param id id string to update
     * @param data the updated data
     */
    protected async _updateData(id: string, data: T): Promise<void>{
        const docRef = doc(ServiceFirebase.db, this.m_dbName, id);
        await updateDoc(docRef, data);
    }

    /**
     * adds a new data to the database
     * @param data the new data
     * @returns the id of the new data
     */
    protected async _addData(data: T, id?: string): Promise<string>{
        if(id){
            const docRef = doc(ServiceFirebase.db, this.m_dbName, id);
            await setDoc(docRef, data);

            return id;
        }
        else{
            const ref = collection(ServiceFirebase.db, this.m_dbName);
            const res = await addDoc(ref, data);
    
            return res.id;
        }
    }

    /**
     * deletes the data from the database based on the id
     * @param id id string to delete
     */
    protected async _deleteData(id: string): Promise<void>{
        const docRef = doc(ServiceFirebase.db, this.m_dbName, id);
        await deleteDoc(docRef);
    }

    /**
     * deletes multiple data from the database based on the id
     * @param ids array of id to be deleted
     */
    protected async _batchDelete(ids: string[]): Promise<void>{
        const batch = writeBatch(ServiceFirebase.db);

        for(const id of ids){
            const docRef = doc(ServiceFirebase.db, this.m_dbName, id);
            batch.delete(docRef);
        }

        await batch.commit();
    }


    // public accessible function that wraps the base function
    /**
     * gets the data from the database based on the id, if the data is already in the cache, it will return the data from the cache
     * this operation will throw an error if the data is not found
     * @param id the id to search
     * @returns the data that matches the id
     */
    public async getById(id: string): Promise<T>{
        debug(`gets data from ${this.m_dbName} with id: ${id}`);

        const cacheResult = this.m_cache.get(id);

        if(cacheResult){
            debug(`Data found in cache`);

            return cacheResult;
        }
        else{
            const data = await this._getById(id);

            if(data){
                debug(`Data found in database`);
                // cache the result
                this.m_cache.set(id, data);

                return data;
            }
        }

        throw new Error("Document not found!");
    }

    /**
     * gets all data from the database, it will return the data from the cache
     * this operation will throw an error if the data is not found
     * @param fetch if fetch sets to true, then fetching will occur regardless if the cache is filled
     * @returns all data from the database
     */
    public async getAllData(fetch?: boolean): Promise<Map<string, T>>{
        debug(`gets all data from ${this.m_dbName}`);

        // if not fetching then the cache will be used instead
        if(!fetch)
            return this.m_cache;

        // get all data from database
        const data = await this._getAllData();

        if(data){
            // cache the result, this will reset the cache
            this.m_cache = data;

            return data;
        }

        throw new Error("Document not found!");
    }

    /**
     * updates the data in the database, may throw an error if the data is not found
     * @param id id of the data
     * @param data the new data
     */
    public async updateData(id: string, data: T): Promise<void>{
        debug(`updates data in ${this.m_dbName} with id: ${id}`);

        await this._updateData(id, data);

        // update the cache
        this.m_cache.set(id, data);
    }

    /**
     * adds a new data to the database
     * @param id id of the data
     * @param data the new data
     */
    public async addData(data: T, id?: string): Promise<string>{
        
        const resId = await this._addData(data, id);
        debug(`added new data to ${this.m_dbName} with id: ${resId}`);
        
        // update the cache
        this.m_cache.set(resId, data);

        return resId;
    }

    /**
     * deletes the data from the database
     * @param id id of the data
     */
    public async deleteData(id: string): Promise<void>{
        debug(`deletes data from ${this.m_dbName} with id: ${id}`);

        await this._deleteData(id);

        // update the cache
        this.m_cache.delete(id);
    }

    public async batchDelete(ids: string[]): Promise<void>{
        debug(`deletes data from ${this.m_dbName} with ids: ${ids}`);

        await this._batchDelete(ids);

        // update the cache
        for(const id of ids)
            this.m_cache.delete(id);
    }
}