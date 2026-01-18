import app from "./app.js";
import AppConfig from "./config/env.js";
import { connectDb, getClient } from "./config/redis.js";

let shuttingDown = false;

async function startServer() {
    console.log('Connecting db...');
    await connectDb();
    const client = await getClient();

    const server = app.listen(AppConfig.PORT, () => {
        console.log(`Server listening on port: ${AppConfig.PORT}`);
    });

    const gracefulShutdown = () => {
        if(shuttingDown) {
            return;
        };
        shuttingDown = true;
        console.log('\nShutting down gracefully....');
        server.close(async() => {
            await client.quit();
            console.log('Closed out remaining connections');
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
