import { config as dotenvconfig } from "dotenv";

dotenvconfig();

const _config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  RABBITMQ_URI: process.env.RABBITMQ_URI,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
};

export default _config;
