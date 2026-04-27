import session from "express-session";
import { RedisStore } from "connect-redis";
import redis from "./redis.ts";
import { v4 as uuidv4 } from 'uuid';

const genId = uuidv4();

const sessionMiddleware = session({
    store: new RedisStore({ client: redis }),
    secret: genId, // "your-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true, // true in production (HTTPS)
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24h
    }
});

export default sessionMiddleware;