import { createClient } from "redis";
import AppConfig from "./env.js";
import logger from "./logger.js";

const client =  createClient({
    username: 'default',
    password: AppConfig.REDIS.PASSWORD,
    socket: {
        host: AppConfig.REDIS.HOST,
        port: AppConfig.REDIS.PORT
    }
});

client.on('error', err => console.error('Redis Client Error', err));
await client.connect();
logger.info("Database Connected");

export default client;
