import express, { type Application } from "express";

// dotenv.config();

const app: Application = express();

app.use(express.json());