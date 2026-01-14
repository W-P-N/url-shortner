import { createClient, SCHEMA_FIELD_TYPE,  } from 'redis';

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
};

export default async function configure() {
    try {
        return await connectDb();
    } catch (e) {
        console.error(e);
    }
};

