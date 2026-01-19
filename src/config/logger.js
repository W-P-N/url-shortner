import pino from "pino";
import AppConfig from "./env.js";

const logger = pino({
    level: AppConfig.NODE_ENV === 'production' ? 'info' : 'debug'
});

export default logger;
