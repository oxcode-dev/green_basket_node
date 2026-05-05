import express from 'express';
import { prisma } from '../lib/prisma.ts';
import type { PaginationType, RequestWithUser } from '../types/index.ts';
import { countUserWishlists, fetchUserWishlistsWithPagination } from '../services/wishlistServices.ts';

export const getUserWishlists = async(req: RequestWithUser & PaginationType, res: express.Response) => {
    try {
        const auth = req.user

        const { page, limit, skip } = req as PaginationType;
        
        const totalCount = await countUserWishlists(String(auth?.id));

        const wishlists = await fetchUserWishlistsWithPagination(String(auth?.id), skip, limit)

        return res.status(200).json({
            message: "User Wishlists retrieved successfully!!!",
            wishlists,
            metadata: {
                page: page,
                limit: limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            }
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const getUserWishlist = async(req: express.Request, res: express.Response) => {
    try {
        const id = String(req?.params?.id);

        if (!await prisma.wishlists.findUnique({ where: { id: id } })) {
            return res.status(404).json({ error: 'Wishlist not found' })
        }
        
        const wishlist = await prisma.wishlists.findFirst({
            where: { 
                id: Array.isArray(id) ? id[0] : id
            },
            include: { product: true }
        });

        return res.status(200).json({
            message: "User Wishlist retrieved successfully!!!",
            wishlist
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const storeWishlist = async (req: any, res: express.Response) => {
    try {
        const auth: {id: string, email: string} = req?.user;

        const product_id = String(req?.params?.product_id);

        if (!await prisma.products.findUnique({ where: { id: product_id } })) {
            return res.status(404).json({ error: 'Product not found' })
        }

        const wishlist = await prisma.wishlists.create({
            data: {
                product_id,
                user_id: auth?.id
            }
        })

        return res.status(200).json({
            message: "User Wishlist added successfully!!!",
            wishlist
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
} 

export const deleteWishlist = async (req: any, res: express.Response) => {
    try {
        const id = String(req?.params?.id)
        if (!await prisma.wishlists.findUnique({ where: { id: id } })) {
            return res.status(404).json({ error: 'Wishlist not found' })
        }

        await prisma.wishlists.delete({
            where: { id: id }
        })

        return res.status(201).json({
            message: 'Wishlist Deleted successfully', 
            status: 'success'
        });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}
