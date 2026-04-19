import express, { type Application } from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.ts";
import { authRoute } from "./routes/authRoute.ts";
import { passwordResetRoute } from "./routes/passwordResetRoute.ts";
import runSeed from "./db_temp.ts";
import { categoriesRoute } from "./routes/categoriesRoute.ts";
import cors from "cors"
import helmet from "helmet";
import morgan from 'morgan'
import { ProductsRoute } from "./routes/productsRoute.ts";
import { profileRouter } from "./routes/profileRoute .ts";
import { ordersRouter } from "./routes/ordersRoute.ts";
import { addressesRoute } from "./routes/addressesRoute.ts";
import { wishlistsRoute } from "./routes/wishlistsRoute.ts";
import { reviewsRoute } from "./routes/reviewsRoute.ts";
import expressListEndpoints from "express-list-endpoints";
import multer from "multer";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use(cookieParser());

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
app.use(bodyParser.urlencoded({ extended: false }))

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

const upload = multer({dest: 'uploads/'});


const PORT: number | string = 2000;

// import crypto from 'crypto';
// console.log(crypto.randomBytes(32).toString('hex'))

app.get('/test', async(req, res) => {
    const users = await prisma.users.findMany({
        omit: {
            password: true,
        }
    });
    const categories = await prisma.categories.findMany();
    const products = await prisma.products.findMany();

    return res.status(200).json({users, categories, products});
});

app.use('/api/auth', authRoute)
app.use('/api/password', passwordResetRoute)
app.use('/api/categories', categoriesRoute)
app.use('/api/products', ProductsRoute)
app.use('/api/profile', profileRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/addresses', addressesRoute)
app.use('/api/wishlists', wishlistsRoute)
app.use('/api/reviews', reviewsRoute)


app.listen(PORT, () =>
    console.log(
        `🟢 Server running in development mode on port ${PORT}`
    )
);

console.log(expressListEndpoints(app));

// runSeed()
//     .then(() => {
//         console.log('Seeding completed successfully.');
//     })
//     .catch((error) => {
//         console.error('Error during seeding:', error);
//     });   