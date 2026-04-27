import express, { type Application } from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.ts";
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
import { localUpload } from "./middlewares/handleUpload.ts";
import sessionMiddleware from "./lib/session.ts";

import fs from 'fs'
import path from 'path'
import { adminRoute } from "./routes/adminRoute.ts";
import { getCartKey } from "./utils/index.ts";
import redis from "./lib/redis.ts";
import session from "express-session";

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

app.get('/session', async (req: any, res) => {
    req.session.user_id = 'abc123';
    // console.log('user_id: ', req.session);

    return res.status(200).json({ message: 'Session set', session: req.session });
});

app.get('/get-session', async (req: any, res) => {
    // req.session.user_id = 'abc123';
    let session = req.session;
    console.log('user_id: ', session);
    return res.status(200).json({ message: 'Session set', session: JSON.stringify(session) });
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

app.post('/add-cart', async(req, res) => {
    const { productId, quantity = 1 }: { productId: string, quantity: number } = req.body;

    const key = getCartKey(req);

    const product = await prisma.products.findUnique({ where: { id: productId } });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const existing = await redis.hget(key, productId);

    if (existing) {
        const item = JSON.parse(existing);
        item.quantity += quantity;
        await redis.hset(key, productId, JSON.stringify(item));
    } else {
        await redis.hset(key, productId, JSON.stringify({
            productId,
            quantity,
            price: product.price
        }));
    }

    const items = await redis.hgetall(key);

    await redis.expire(key, 60 * 60 * 24); // TTL

    return res.status(500).json({ message: 'server error', items, session: JSON.stringify(req.session.id), key });


    // res.json({ message: "Added to cart" });
});

app.get('/get-cart', async(req, res) => {
    const key = getCartKey(req);
    
    const items = await redis.hgetall(key);

    const parsed = Object.values(items).map(item => JSON.parse(item));

    const total = parsed.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    await redis.flushall();

    res.json({ items, key, session: JSON.stringify(req.session.id) });
    // res.json({ items: parsed, total, session: JSON.stringify(req.session.id), key });
});

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