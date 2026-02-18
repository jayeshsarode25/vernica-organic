import { config as dotenvconfig } from "dotenv";


dotenvconfig();


const _config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET, 
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PORT:process.env.REDIS_PORT,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD,
    RABBITMQ_URI:process.env.RABBITMQ_URI
}


export default _config;