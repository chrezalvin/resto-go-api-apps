const debug = require("debug")("Server:Service");

import { supabase } from "@config";
import { SupabaseClient } from "@supabase/supabase-js";

type PostgresQueryBuilder = ReturnType<typeof supabase.from>;
type PostgresFilterBuilder = ReturnType<PostgresQueryBuilder["select"]>;

/**
 * Service class to handle the database operation, this class will cache the data to reduce the payload
 */
export class ServiceSupabase<_T extends Object, _K extends Extract<keyof _T, string>>{
    public static s_services: ServiceSupabase<any, any>[] = [];

    protected m_cache: Map<_T[_K], _T> = new Map();
    protected m_keyName: _K;
    protected m_tableName: string;
    protected m_typeGuard?: (value: unknown) => value is _T;
    protected m_useCache: boolean = true;

    // getter
    /**
     * the name of the table
     */
    get tableName(): string { return this.m_tableName; }

    /**
     * the key name from the table's column
     */
    get keyName(): _K { return this.m_keyName; }

    /**
     * the supabase's client
     */
    get client() { return supabase.from(this.m_tableName); }

    /**
     * the cached data in array form, it's supposed to return the full data in the database
     */
    get cache(): _T[]{ 
        const res = [];
        for(const [_, data] of this.m_cache)
            res.push(data);
        return res;
    }

    /**
     * the length of the cached data
     */
    get length(): number { return this.m_cache.size; }
    
    /**
     * creates a new service class
     * @param keyName the unique key from the table
     * @param tableName supabase table name
     * @param option optional typeguard to check the data type, if not set, it will assume the data is already _T[]
     */
    constructor(
        keyName: _K, 
        tableName: string,
        option: {
            typeGuard?: (value: unknown) => value is _T,
            useCache?: boolean,
        }
    ){
        this.m_keyName = keyName;
        this.m_tableName = tableName;
        this.m_typeGuard = option.typeGuard;

        this.getAll()
            .then(() => debug(`Service class created with key: ${this.m_keyName.toString()} and table: ${this.m_tableName}`))
            .catch(err => debug(`Service class created with key: ${this.m_keyName.toString()} and table: ${this.m_tableName}, error: ${err}`));
        debug(`Service class created with key: ${this.m_keyName.toString()} and table: ${this.m_tableName}`);

        ServiceSupabase.s_services.push(this);
    }

    /**
     * get all the data from supabase, ignoring the cache
     * this function will also resets the cache to empty
     * @returns the data in array format
     */
    async getAll(): Promise<_T[]>{
        const res = await supabase.from(this.m_tableName).select("*");
        if(res.error)
            throw new Error(res.error.message);

        // filter the data based on the typeguard
        const data = (this.m_typeGuard ? res.data.filter(ele => this.m_typeGuard?.(ele)): res.data) as _T[];

        if(this.m_useCache){
            // reset cache
            this.m_cache.clear();
    
            // then fill the cache with the retrieved data
            for(const item of data)
                this.m_cache.set(item[this.m_keyName], item);
        }

        return data;
    }

    /**
     * Get data based on the key, if the data is not found in the cache, it will fetch the data from the database
     * @param key the key to search
     * @returns the data that matches the key, undefined if not found
     */
    async get(key: _T[_K]): Promise<_T | undefined>{
        // search on the cache first
        const item = this.m_cache.get(key);
        if(item)
            return item;
        else{
            // if not found, search on the database
            const res = await supabase.from(this.m_tableName).select("*").eq(this.m_keyName, key);
            if(res.error)
                throw new Error(res.error.message);

            // if the data is found, add it to the cache
            if(res.data.length !== 0){
                const data = res.data[0] as _T;

                if(this.m_useCache)
                    this.m_cache.set(data[this.m_keyName], data);

                return data;
            }
        }
    }

    /**
     * Insert a new data into database and updates the cache, will return false if the insert fail
     * @param value data to be inserted, without the key
     * @param keyValue optional key value, if not set, it will use the key from the value
     */
    async add(value: Omit<_T, _K>, keyValue?: _K): Promise<_T | undefined>{
        // remove the key from the value since key is permanent
        const data = keyValue ? {...value, [this.m_keyName]: keyValue} : value;
        const res = await supabase
                .from(this.m_tableName)
                .insert(data)
                .select();

        if(res.error)
            throw new Error(res.error.message);

        const returnedData = res.data[0] as unknown;

        if(this.m_typeGuard && this.m_typeGuard(returnedData)){
            if(this.m_useCache)
                this.m_cache.set(returnedData[this.m_keyName], returnedData);

            return returnedData;
        }
        else return undefined;
    }

    /**
     * get data based on pred, this function will only search the data within the cache
     * @param pred the search function
     * @returns data that matches the pred
     */
    getWhere(pred: (val: _T) => boolean): _T[]{
        const res = [];
        for(const [_, data] of this.m_cache)
            if(pred(data))
                res.push(data);
        return res;
    }

    /**
     * Updates the data in the database, also updates the one in cache
     * 
     * if the data is not found in the database, it will throw an error
     * 
     * if the data is not found in the cache, it will still attempt to update the data in the database and add it to the cache if the update is successful
     * @param key 
     * @param value 
     */
    async update(key: _T[_K], value: Partial<Omit<_T, _K>>): Promise<_T | undefined>{
        const res = await supabase
                .from(this.m_tableName)
                .update(value)
                .eq(this.m_keyName, key)
                .select();

        if(res.error)
            throw new Error(res.error.message);

        const data = res.data[0] as unknown;

        if(this.m_typeGuard && this.m_typeGuard(data)){
            if(this.m_useCache)
                this.m_cache.set(key, data);            

            return data;
        }
        else return undefined;
    }

    /**
     * deletes the data from the database based on the key, also deletes the data from the cache
     * @param key 
     * @returns 
     */
    async delete(key: _T[_K]): Promise<string | undefined>{
        const res = await supabase
            .from(this.m_tableName)
            .delete()
            .eq(this.m_keyName, key);

        if(!res.error && this.m_useCache)
            this.m_cache.delete(key);

        return res.error?.message;
    }

    async query(fn: (client: PostgresQueryBuilder) => PostgresFilterBuilder): Promise<_T[]>{
        // call the function then return the result
        const res = await fn(supabase.from(this.m_tableName));

        if(res.error)
            throw new Error(res.error.message);

        if(this.m_typeGuard)
            return res.data.filter(ele => this.m_typeGuard?.(ele)) as _T[];
        else
            return res.data as _T[];
    }

    async rpc(fcnName: string, ...args: any[]): Promise<_T[]>{
        const res = await supabase.rpc(fcnName, {...args});

        if(res.error)
            throw new Error(res.error.message);

        const data = res.data as unknown;
        
        if(Array.isArray(data))
            return data.filter(ele => this.m_typeGuard?.(ele)) as _T[];

        throw new Error("Invalid data type");
    }
}

export default ServiceSupabase;