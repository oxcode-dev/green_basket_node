import express, { type Application } from "express";
import dotenv from 'dotenv'

dotenv.config();

const app: Application = express();

app.use(express.json());

const PORT: number | string = 2000;

app.listen(PORT, () =>
  console.log(
    `🟢 Server running in development mode on port ${PORT}`
  )
);