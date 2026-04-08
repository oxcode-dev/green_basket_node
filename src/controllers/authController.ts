import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.ts';

const JWT_SECRET = process.env.JWT_SECRET as string;
const MONTH = 30 * 24 * 60 * 60; // in seconds

// Router for user registration
export const userRegistration = async (req: express.Request, res: express.Response) => {
    try {

        const { email, password, first_name, last_name, username } = req.body;
        if(!first_name || !last_name || !email || !username || !password || password.length < 6) {
            return res.status(400).json({
                message: "Required fields are missing!",
            })
        }
        const userExists = await prisma.users.findUnique({ where: {email} });

        if(userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                first_name,
                last_name,
            }
        });

        const payload = { 
            id: newUser.id,
            email: newUser.email,
        }

        const token = createToken(payload);
        const refresh_token = createToken(payload, MONTH);

        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/api/token",
            // path: "/api/refresh_token",
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
        });

        return res.status(201).json({
            token, 
            message: 'User registered successfully', 
            user: { 
                id: newUser.id,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                phone: newUser.phone,
            }
        });

    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

// Router for user login
export const userLogin = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findUnique({ where: {email} });

        if(!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user?.password)

        if(!user || !isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { 
            id: user.id,
            email: user.email,
        }

        const token = createToken(payload);
        const refresh_token = createToken(payload, MONTH);

        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/api/refresh_token",
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
        });
        res.cookie("token", token, {
            httpOnly: true,
            path: "/api/token",
            // path: "/api/refresh_token",
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
        });
        
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                avatar: user.avatar,
                bio: user.bio,
            },
            message: 'Login successful'
        });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const userLogout = async (req: express.Request, res: express.Response) => {
    try {
        // Clearing JWT cookie
        // res.cookie("token", "", { maxAge: 0 });
        res.cookie("token", "", {
            httpOnly: true, // Important for security
            expires: new Date(Date.now()), // Set expiration to the current time or past
            // secure: process.env.NODE_ENV === "production" // Use secure in production
        });
        res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
        // Sending success response
        res.status(201).json({ message: "Logged out successfully" });
    } catch (error: any) {
        // Handling errors
        res.status(500).json({ error: `Internal Server Error: ${error}` });
    }
};

type PayloadType = {
    id: string;
    email: string;
}

const createToken = (payload: PayloadType, expiresIn: number = 3600*1) => {
    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: expiresIn},
    );
}
