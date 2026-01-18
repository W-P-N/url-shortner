import logger from "./config/logger.js";

import app from "./app.js";
import AppConfig from "./config/env.js";
import client from "./config/redis.js";

let shuttingDown = false;

async function startServer() {
    const server = app.listen(AppConfig.PORT, () => {
        logger.info(`Server listening on: ${AppConfig.PORT}`);
    });

    const gracefulShutdown = () => {
        if(shuttingDown) {
            return;
        };
        logger.info('\nShutting down gracefully...');
        shuttingDown = true;
        server.close(async() => {
            await client.quit();
            process.exit(0);
        });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
};

startServer().catch(err => {
    logger.error("Failed to start server: ", err);
    process.exit(1);
});
