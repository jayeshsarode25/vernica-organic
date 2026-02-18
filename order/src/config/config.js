import { config as dotenvconfig } from "dotenv";


dotenvconfig();


const _config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    RABBITMQ_URI:process.env.RABBITMQ_URI
}


export default _config;