import { createClient } from "redis";
import AppConfig from "./env.js";

let client;

export async function connectDb() {
    if(client) {
        return client;
    };
    console.log("Client definition")
    client = createClient({
        username: 'default',
        password: AppConfig.REDIS.PASSWORD,
        socket: {
            host: AppConfig.REDIS.HOST,
            port: AppConfig.REDIS.PORT
        }
    });
    console.log("Client definition done")
    client.on('error', err => console.error('Redis Client Error', err));
    console.log("Client connect()")
    await client.connect();
    console.log("Database Connected");
    return client;
};

export async function getClient() {
    if(!client) {
        client = await connectDb();
    };
    return client;
};
