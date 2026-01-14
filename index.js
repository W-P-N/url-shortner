import express from 'express';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import cors from 'cors';
import { createClient } from 'redis';
import bcrypt from 'bcryptjs';

const app = express();
// To Parse JSON data - application/json
app.use(express.json());
// Enable secure cross origin resource sharing
app.use(cors());

dotenv.config({
    path: './.env'
});

// Database connection
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

app.get('/:link', async(req, res) => {
    try {
        const long_url = await client.hGet(`links:${req.params.link}`, 'l_url');
        // Debug log
        // console.log(long_url);
        res.redirect(long_url);
    } catch(error) {
        console.error(error);
        return res.status(500).send({message: "Unable to get req link"});
    }
});

app.post('/api/link', async (req,res) => {
    const url = req.body.url;
    const new_url_nano = nanoid(7);
    const new_url = `http://127.0.0.1:${process.env.PORT}/${new_url_nano}`;
    const url_map = {
        s_url: new_url,
        l_url: url
    };
    // Debug log
    // console.log(url_map);
    try {
        await client.hSet(`links:${new_url_nano}`, url_map);
    } catch (error) {
        console.error(error);
        return res.status(502).send({message: "Bad Gateway: Unable to process request"})
    }
    return res.status(200).send({data: new_url, message: "success"});
});

// Debug Log
// console.log(process.env);

app.listen(process.env.PORT, (e) => {
    console.log("App listening on port: ", process.env.PORT);
});




