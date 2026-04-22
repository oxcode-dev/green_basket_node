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
    console.log(req.user)
    return req.user.role === 'CUSTOMER' ? next() : res.status(403).json({ message: 'Access denied: Customers only' });
    // const authHeader = req.headers['authorization'];

    // if(!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.status(401).json({ message: 'Kindly login to access this resource' });
    // }

    // const token : string = authHeader.split(' ')[1] || '';

    // try {
        
    //     const decoded = jwt.verify(
    //         token,
    //         JWT_SECRET
    //     ) as DataStoredInToken;

    //     req.user = await prisma.users.findFirst({
    //         where: {id: decoded?.id}
    //     })

    //     next();
    // } catch (error) {
    //     // console.error("Token verification error: ", error || 'Server error');
    //     res.status(401).json({ message: "User Logged out" });
    // }
}

export { handleCustomer };