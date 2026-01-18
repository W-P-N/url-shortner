import RateLimit from "express-rate-limit";
import RedisStore from 'rate-limit-redis';
import client from "../config/redis.js";

export const apiLimiter = RateLimit({
    store: new RedisStore({
        sendCommand: async (...args) => client.sendCommand(args)
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 req per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests, please try again later."
    }
});
