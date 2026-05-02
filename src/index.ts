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
import { createClient } from "redis";
import { cacheClient } from "./lib/redis.ts";
import { getCartKey } from "./utils/index.ts";

// const client = await createClient()
//     .on("error", (err) => console.log("Redis Client Error", err))
//     .connect();

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


app.post('/test-redis', async (req: any, res: express.Response) => {
    // await cacheClient.set("key", "2b502d83205b4fe68b1577a92239d4ab58e520e1b56969d1bcd7c048e95afbdf");
    const { productId, quantity = 1 }: { productId: string, quantity: number } = req.body;
    
    const key = getCartKey(req);

    const existing = await cacheClient.get(key);

    if (existing) {
        const item = JSON.parse(existing);
        item.quantity += quantity;
        await cacheClient.set(key, JSON.stringify(item));
    } else {
        await cacheClient.set(key, JSON.stringify({
            productId,
            quantity,
            // price: product.price
        }));
    }

    // const items = await cacheClient.getall(key);


    const value = await cacheClient.get(key);

    res.json({ message: "Key set in Redis", value: value });
});

app.get('/test-redis', async (req: any, res: express.Response) => {
    // const value = await cacheClient.get("key");
    const key = getCartKey(req);

    const value = await cacheClient.get(key);

    res.json({ key: value ? JSON.parse(value) : [] });
});

app.delete('/test-redis', async (req: any, res: express.Response) => {
    const value = await cacheClient.del("key");
    res.json({ key: value });
});

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