import express, { type Application } from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// import runSeed from "./db_temp.ts";
import cors from "cors"
import helmet from "helmet";
import morgan from 'morgan'
import sessionMiddleware from "./lib/session.ts";
import session from "express-session";
import swaggerDocs from "./lib/swagger.ts";
import routes from "./routes/index.ts";
import rateLimiter from 'express-rate-limit';
import testRoutes from "./routes/testRoute.ts";

dotenv.config();

const app: Application = express();

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict'
    }
}));

app.use(express.json());

app.use(express.static('src/uploads'))

const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(','),
};

app.use(cors(corsOptions));

// Middleware to parse JSON data
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Reduce to 50 requests
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health' // Skip health checks
}));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    strictTransportSecurity: { maxAge: 31536000 }
}));
app.use(morgan("common"));

const PORT: number | string = 2000;

app.use(sessionMiddleware);

// import crypto from 'crypto';
// console.log(crypto.randomBytes(32).toString('hex'))


const isDev = process.env.NODE_ENV !== 'production';

app.listen(PORT, () => {
    console.log(`🟢 Server running in ${isDev ? 'development' : 'production'} mode on port ${PORT}`);

    swaggerDocs(app, PORT);

    routes(app)

    testRoutes(app)
});

// runSeed()
//     .then(() => {
//         console.log('Seeding completed successfully.');
//     })
//     .catch((error) => {
//         console.error('Error during seeding:', error);
//     });

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : err.message
    });
});