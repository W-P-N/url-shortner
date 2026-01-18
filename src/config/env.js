import dotenv from 'dotenv';

dotenv.config({
    path: './src/config/.env'
});

const AppConfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    APP_BASE_URL: process.env.APP_BASE_URL || `http://127.0.0.1:${process.env.PORT}`,
    LINK_LENGTH: parseInt(process.env.LINK_LENGTH, 10),
    REDIS: {
        PASSWORD: process.env.REDIS_DB_PASSWORD,
        HOST: process.env.REDIS_DB_HOST,
        PORT: process.env.REDIS_PORT
    }
};

if(isNaN(AppConfig.LINK_LENGTH)) {
    throw new Error('LINK_LENGTH in .env must be a valid number.');
};

export default AppConfig;
