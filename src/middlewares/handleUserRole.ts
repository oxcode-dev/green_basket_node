import { config } from "dotenv";
import express from "express";
import jwt from 'jsonwebtoken'
import { prisma } from "../lib/prisma.ts";
// import { AuthUserType, DataStoredInToken } from "../types/index.ts";

config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface DataStoredInToken {
  id: string;
  email: string;
}

const handleCustomer = async (req: any, res: express.Response, next: express.NextFunction)  => {
    return req.user.role === 'CUSTOMER' ? next() : res.status(403).json({ message: 'Access denied: Customers only' });
}

const handleAdmin = async (req: any, res: express.Response, next: express.NextFunction)  => {
    return req.user.role === 'ADMIN' ? next() : res.status(403).json({ message: 'Access denied: Admins only' });
}

export { handleCustomer, handleAdmin };