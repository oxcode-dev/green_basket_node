import express, { type Application } from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { authRoute } from "./routes/authRoute.ts";
import { passwordResetRoute } from "./routes/passwordResetRoute.ts";
// import runSeed from "./db_temp.ts";
import { categoriesRoute } from "./routes/categoriesRoute.ts";
import cors from "cors"
import helmet from "helmet";
import morgan from 'morgan'
import { ProductsRoute } from "./routes/productsRoute.ts";
import { profileRoute } from "./routes/profileRoute .ts";
import { ordersRoute } from "./routes/ordersRoute.ts";
import { addressesRoute } from "./routes/addressesRoute.ts";
import { wishlistsRoute } from "./routes/wishlistsRoute.ts";
import { reviewsRoute } from "./routes/reviewsRoute.ts";
import sessionMiddleware from "./lib/session.ts";

import fs from 'fs'
import path from 'path'
import { adminRoute } from "./routes/adminRoute.ts";
import session from "express-session";
import { cartRoute } from "./routes/cartRoute.ts";

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

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

const PORT: number | string = 2000;

app.use(sessionMiddleware);

// import crypto from 'crypto';
// console.log(crypto.randomBytes(32).toString('hex'))

app.get('/api/delete-image/:filename', (req: any, res: express.Response) => {

    const filePath = path.join(__dirname, '/../../uploads/avatars', req.params.filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            // console.error(err);
            return res.status(500).send(`Error deleting file: ${err}`);
        }
        res.status(200).send('File deleted successfully');
    })
})

app.use('/api/auth', authRoute)
app.use('/api/password', passwordResetRoute)
app.use('/api/categories', categoriesRoute)
app.use('/api/products', ProductsRoute)
app.use('/api/profile', profileRoute)
app.use('/api/orders', ordersRoute)
app.use('/api/addresses', addressesRoute)
app.use('/api/wishlists', wishlistsRoute)
app.use('/api/reviews', reviewsRoute)
app.use('/api/admin', adminRoute)
app.use('/api/cart', cartRoute)


app.listen(PORT, () =>
    console.log(
        `🟢 Server running in development mode on port ${PORT}`
    )
);

// runSeed()
//     .then(() => {
//         console.log('Seeding completed successfully.');
//     })
//     .catch((error) => {
//         console.error('Error during seeding:', error);
//     });   