import express from 'express';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import cors from 'cors';
import { createClient } from 'redis';
import bcrypt from 'bcryptjs';
import configure from './config.js';

const app = express();
// To Parse JSON data - application/json
app.use(express.json());
// Enable secure cross origin resource sharing
app.use(cors());

dotenv.config({
    path: './.env'
});

// Database connection
const client = await configure();

// Functions
function validateUrl(input) {
    try {
        const url = new URL(input);
        // Restricted to 'http' and 'https'
        if(!['http:', 'https:'].includes(url.protocol)) {
            return false;
        };
        // Length constraint
        if(input.length > 2048) {
            return false;
        };
        // Embedded credentials not allowed
        if(url.username || url.password) {
            return false;
        };
        return true;
    } catch (error) {
        console.error('URL Validation: ', error);
        return false;
    }
};

app.get('/:link', async(req, res) => {
    try {
        const input = req.params.link;
        const link_length = parseInt(process.env.LINK_LENGTH, 10);
        if(!input || input.length < link_length) {
            return res.status(400).send({message: "Invalid input"});
        };
        const long_url = await client.get(`links:${req.params.link}`);
        // Debug log
        // console.log(long_url);
        if(long_url) {
            return res.redirect(301, long_url);
        };
        return res.status(404).send({message: "URL not found"});
    } catch(error) {
        console.error(error);
        return res.status(404).send({message: "Unable to get req link"});
    }
});

app.post('/api/link', async (req,res) => {
    const url = req.body.url;
    if(!validateUrl(url)) {
        return res.status(400).send({message: "Malformed URL sent."});
    };
    const link_length = parseInt(process.env.LINK_LENGTH, 10);
    if(isNaN(link_length)) {
        throw new Error('LINK_LENGTH must be a valid number.');
    };

    let short_code;
    let success = false;
    const maxRetries = 5;

    for(let i=0; i<maxRetries; i++) {
        short_code = nanoid(link_length);
        const result = await client.setNX(`links:${short_code}`, url);
        if(result == 1) {
            success = true;
            break;
        };
    };
    if(!success) {
        return res.status(500).send({ message: "Failed to generate unique code after multiple attempts."});
    };

    const new_url = `http://127.0.0.1:${process.env.PORT}/${short_code}`;
    // Debug log
    // console.log(url_map);
    try {
        await client.set(`links:${short_code}`, url);
    } catch (error) {
        console.error(error);
        return res.status(502).send({message: "Bad Gateway: Unable to process request"})
    }
    return res.status(200).send({data: new_url, message: "success"});
});

// Debug Log
// console.log(process.env);

const server = app.listen(process.env.PORT, (e) => {
    console.log("App listening on port: ", process.env.PORT);
});

let shutting_down = false;

const gracefulShutdown = () => {
    if(shutting_down) {
        return;
    };
    console.log('\nShutting down gracefully...');
    shutting_down = true;
    server.close(async() => {
        await client.quit();
        console.log('Closed out remaning connections');
        process.exit(0);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);




