import express from 'express';
import { prisma } from '../lib/prisma.ts';
import type { RequestWithUser } from '../types/index.ts';
import { destroyAddress, fetchAddress, fetchUserAddresses, storeAddress, updateAddress } from '../services/addressServices.ts';
import { string } from 'zod';


export const getUserAddresses = async (req: RequestWithUser, res: express.Response) => {
    try {
        const auth = req.user

        const addresses = await fetchUserAddresses(String(auth?.id))

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

export const getUserAddress = async (req: RequestWithUser, res: express.Response) => {
    try {
        const auth = req.user;
        const id = String(req?.params?.id || '');

        const address = await fetchAddress(id)

        if (!address) {
            return res.status(404).json({ error: 'Address not found' })
        }

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

export const storeUserAddress = async (req: RequestWithUser, res: express.Response) => { 
    try {
        const auth = req.user;
        const { street, city, postal_code, state, country, is_default } = req.body  as { street: string, city: string, postal_code: string, state: string, country: string, is_default: boolean };

        const address = await storeAddress({
            street: street,
            city: city || '',
            state: state, 
            postal_code: postal_code,
            country: country,
            user_id: String(auth?.id),
            is_default: is_default
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

export const updateUserAddress = async (req: RequestWithUser, res: express.Response) => { 
    try {
        const id = String(req?.params?.id)

        const userAddress = await fetchAddress(id)

        if (!userAddress) {
            return res.status(404).json({ error: 'Address not found' })
        }

        const auth = req.user;

        const { street, city, postal_code, state, country, is_default } = req.body  as { street: string, city: string, postal_code: string, state: string, country: string, is_default: boolean };

        const address = await updateAddress(id, {
            street: street,
            city: city,
            state: state, 
            postal_code: postal_code,
            country: country,
            user_id: String(auth?.id),
            is_default: is_default
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

export const deleteUserAddress = async (req: RequestWithUser, res: express.Response) => { 
    try {
        const id = String(req?.params?.id)

        const userAddress = await fetchAddress(id)

        if (!userAddress) {
            return res.status(404).json({ error: 'Address not found' })
        }

        await destroyAddress(id)

        return res.status(201).json({
            message: 'Address Deleted successfully', 
            status: 'success'
        });
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}