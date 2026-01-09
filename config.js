import { createClient } from 'redis';

async function connectDb() {
    const client = createClient({
        username: 'default',
        password: process.env.REDIS_DB_PASSWORD,
        socket: {
            host: process.env.REDIS_DB_HOST,
            port: process.env.REDIS_PORT
        }
    });
    
    client.on('error', err => console.log('Redis Client Error', err));
    
    await client.connect();
    console.log("Database Connected");
    await client.close();
    console.log("Database Closed");
};

export default async function configure() {
    try {
        await connectDb();
    } catch (e) {
        console.error(e);
    }
};

