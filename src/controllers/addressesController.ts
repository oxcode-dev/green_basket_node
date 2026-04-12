import express from 'express';
import { prisma } from '../lib/prisma.ts';


export const getUserAddresses = async (req: express.Request, res: express.Response) => {
    try {
        const auth = req.user

        const addresses = await prisma.addresses.findMany({
            include: { user: true },
            orderBy: { created_at: 'desc' },
            where: { user_id: auth?.id}
        });

        let data = {
            status: "success",
            message: "User Addresses fetched successfully",
            addresses,
        }

        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const getUserAddress = async (req: express.Request, res: express.Response) => {
    try {
        const auth = req.user;
        const { id } = req.params;
        
        const address = await prisma.addresses.findMany({
            include: { user: true },
            where: { user_id: auth?.id, id: id}
        });

        let data = {
            status: "success",
            message: "Address fetched successfully",
            address,
        }

        res.status(200).json(data);
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}