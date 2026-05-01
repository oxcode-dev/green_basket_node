import Redis from "ioredis";
import { createClient } from "redis";
import dotenv from 'dotenv'

dotenv.config();

const host = process.env.REDIS_HOST || "127.0.0.1";
const port = process.env.REDIS_PORT || 6379;
const url = process.env.REDIS_URL || `redis://${host}:${port}`;

//@ts-ignore
const redis = new Redis.default({
  host: host,
  port: port,
});

export default redis;


// const options = { host: host, port: port }; // for local server
// const options = { url: url };
// const cacheClient = createClient();

const cacheClient = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export { cacheClient };