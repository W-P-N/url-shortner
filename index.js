import express from 'express';
import dotenv from 'dotenv';
import configure from './config.js';

const app = express();
dotenv.config({
    path: './.env'
});
configure();
// Debug Log
// console.log(process.env);



