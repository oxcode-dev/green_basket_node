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
    secret: '2b502d83205b4fe68b1577a92239d4ab58e520e1b56969d1bcd7c048e95afbdf', //'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(express.json());

app.use(express.static('src/uploads'))

const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], 
    credentials: true,
    origin: [process.env.CLIENT_URL || 'http://localhost:2000', 'http://localhost:3000', 'https://nigerian-states-councils-admin.vercel.app/'],
    headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: "*" },
    ],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware to parse JSON data
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
}));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

const PORT: number | string = 2000;

app.use(sessionMiddleware);

// import crypto from 'crypto';
// console.log(crypto.randomBytes(32).toString('hex'))


app.listen(PORT, () => {
    console.log(
        `🟢 Server running in development mode on port ${PORT}`
    );

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