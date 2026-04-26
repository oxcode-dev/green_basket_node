// config/session.js
// const session = require("express-session");
// const RedisStore = require("connect-redis").default;
// const redis = require("./redis");

import session from "express-session";
import { RedisStore } from "connect-redis";
import redis from "./redis.ts";

const sessionMiddleware = session({
  store: new RedisStore({ client: redis }),
  secret: "your-secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true in production (HTTPS)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24h
  }
});

module.exports = sessionMiddleware;