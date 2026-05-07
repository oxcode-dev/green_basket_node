import { config } from "dotenv";
import express from "express";
import jwt from 'jsonwebtoken'
import type { RequestWithUser } from "../types/index.ts";
import { User } from "../models/index.ts";

config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface DataStoredInToken {
  id: string;
  email: string;
}

const auth = async (req: RequestWithUser, res: express.Response, next: express.NextFunction)  => {
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Kindly login to access this resource' });
    }

    const token : string = authHeader.split(' ')[1] || '';

    try {
        
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as DataStoredInToken;

        const user = await User.findFirst({
            where: {id: decoded?.id},
        })

        if(user) {
            req.user = {
                id: user?.id,
                email: user?.email,
                role: user?.role,
            }
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "User Logged out" });
    }
}

export { auth };