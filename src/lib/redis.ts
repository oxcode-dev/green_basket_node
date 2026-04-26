import Redis from "ioredis";


//@ts-ignore
const redis = new Redis.default({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379
});

export default redis;

