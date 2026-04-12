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
        const id = String(req?.params?.id || '');
        
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

export const storeUserAddress = async (req: express.Request, res: express.Response) => { 
    try {
        const auth = req.user;
        const { street, city, postal_code, state } = req.body;

        const address = await prisma.addresses.create({
            data: {
                street,
                city,
                state, 
                postal_code,
                user_id: auth?.id
            }
        })

        return res.status(201).json({
            message: 'Address Created successfully', 
            address,
            status: 'success'
        });
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const updateUserAddress = async (req: express.Request, res: express.Response) => { 
    try {
        const id = String(req?.params?.id)

        if (!await prisma.addresses.findUnique({ where: { id: id } })) {
            return res.status(404).json({ error: 'Address not found' })
        }

        const auth = req.user;
        const { street, city, postal_code, state } = req.body;

        const address = await prisma.addresses.update({
            where: { id: id },
            data: {
                street,
                city,
                state, 
                postal_code,
                user_id: auth?.id
            }
        })

        return res.status(201).json({
            message: 'Address Updated successfully', 
            address,
            status: 'success'
        });
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const deleteUserAddress = async (req: express.Request, res: express.Response) => { 
    try {
        const id = String(req?.params?.id)
        if (!await prisma.addresses.findUnique({ where: { id: id } })) {
            return res.status(404).json({ error: 'Address not found' })
        }

        const auth = req.user;

        const address = await prisma.addresses.delete({
            where: { id: id }
        })

        return res.status(201).json({
            message: 'Address Delete successfully', 
            address,
            status: 'success'
        });
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}