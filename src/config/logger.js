import pino from "pino";
import AppConfig from "./env.js";

const logger = pino({
    level: AppConfig.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: AppConfig.NODE_ENV !== 'production' ? {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    } : undefined
});

export default logger;
