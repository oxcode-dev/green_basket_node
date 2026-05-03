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

const checkAuthForCart = async (req: any, res: express.Response, next: express.NextFunction)  => {

    try {
        const authHeader = req.headers['authorization'];

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return next()
            // return res.status(401).json({ message: 'Kindly login to access this resource' });
        }

        const token : string = authHeader.split(' ')[1] || '';
        
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as DataStoredInToken;

        const user = await prisma.users.findFirst({
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
        console.error("Token verification error: ", error || 'Server error');
        // res.status(401).json({ message: "User Logged out" });
    }
}

export { checkAuthForCart };