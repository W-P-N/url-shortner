import { createClient } from "redis";
import AppConfig from "./env.js";

let client;

export async function connectDb() {
    if(client) {
        return client;
    };
    client = createClient({
        username: 'default',
        password: AppConfig.REDIS.PASSWORD,
        socket: {
            host: AppConfig.REDIS.HOST,
            port: AppConfig.REDIS.PORT
        }
    });
    client.on('error', err => console.error('Redis Client Error', err));
    await client.connect();
    return client;
};

export async function getClient() {
    if(!client) {
        client = await connectDb();
    };
    return client;
};
