import app from "./app.js";
import AppConfig from "./config/env.js";
import { connectDb, getClient } from "./config/redis.js";

let shuttingDown = false;

async function startServer() {
    await connectDb();
    const client = await getClient();

    const server = app.listen(AppConfig.PORT, () => {
    });

    const gracefulShutdown = () => {
        if(shuttingDown) {
            return;
        };
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
    console.error("Failed to start server: ", err);
    process.exit(1);
});
