import express, { type Application } from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.ts";
import { authRoute } from "./routes/authRoute.ts";
import { passwordResetRoute } from "./routes/passwordResetRoute.ts";

dotenv.config();

const app: Application = express();

app.use(express.json());

// Middleware to parse JSON data
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser());

const PORT: number | string = 2000;

// import crypto from 'crypto';
// console.log(crypto.randomBytes(32).toString('hex'))

app.get('/test', async(req, res) => {
    const user = await prisma.users.findMany();

    return res.status(200).json(user);

    // return res.status(200).json({message: 'New Endpoint'})
});

app.use('/api/auth', authRoute)
app.use('/api/password', passwordResetRoute)


app.listen(PORT, () =>
  console.log(
    `🟢 Server running in development mode on port ${PORT}`
  )
);