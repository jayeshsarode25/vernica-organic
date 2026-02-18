import Redis from "ioredis";
import config from '../config/config.js'



export const redis = new Redis({
    host:config.REDIS_HOST,
    port:config.REDIS_PORT,
    password:config.REDIS_PASSWORD,
})

redis.on("connect",()=>{
    console.log("connect to redis");
})

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

redis.on("close", () => {
  console.warn("Redis connection closed");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});