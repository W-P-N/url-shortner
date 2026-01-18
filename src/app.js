import express from 'express';
import cors from 'cors';
import { apiRouter, redirectRouter } from './routes/link.routes.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', apiLimiter, apiRouter);

app.use('/', redirectRouter);

export default app;
