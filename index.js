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
function validateUrl(url) {
    try {
        const url = new URL(url);
        // Restricted to 'http' and 'https'
        if(!['http:', 'https:'].includes(url.protocol)) {
            return false;
        };
        // Length constraint
        if(url.length > 2048) {
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
        const long_url = await client.hGet(`links:${req.params.link}`, 'l_url');
        // Debug log
        // console.log(long_url);
        if(long_url) {
            return res.redirect(long_url);
        };
        return res.status(502).send({message: "URL not found"});
    } catch(error) {
        console.error(error);
        return res.status(500).send({message: "Unable to get req link"});
    }
});

app.post('/api/link', async (req,res) => {
    const url = req.body.url;
    if(!validateUrl(url)) {
        return res.status(400).send({message: "Malformed URL sent."});
    };
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




