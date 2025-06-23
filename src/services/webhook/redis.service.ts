import { redisClient } from "../../db/redis";

export const getFromCache = async (key: string): Promise<string | null> => {
    try {
        
        
        const value = await redisClient.get(key);
        console.log("Getting from cache Redis:", value);
        return value ? value : null;
        
    } catch (error) {
        console.error("Error getting from cache:", error);
        return null;
    }
};

export const setToCache = async (key: string, value: string , ttl:number = 1): Promise<void> => {
    try {
        console.log("Setting to cache Redis:", key, "Value:", value, "TTL:", ttl);
        
        await redisClient.setex(key, ttl, value);
    } catch (error) {
        console.error("Error setting to cache:", error);
    }
};
