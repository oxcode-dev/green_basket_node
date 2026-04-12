import express from 'express';
import { prisma } from '../lib/prisma.ts';


export const getUserOrders = async (req: express.Request, res: express.Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const getUserOrder = async (req: express.Request, res: express.Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}