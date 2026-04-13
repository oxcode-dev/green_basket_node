import express from 'express';
import { prisma } from '../lib/prisma.ts';

export const getUserWishlists = async(req: express.Request, res: express.Response) => {
    try {

        const { page = 1, limit = 1 } = req.query as {page?: string | number, limit?: string | number};
        const pageNum = typeof page === 'string' ? parseInt(page) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
        const skip = (pageNum - 1) * limitNum;
        
        const totalCount = await prisma.wishlists.count();

        const wishlists = await prisma.wishlists.findMany({
            skip: Number(skip),
            take: Number(limit),
            include: { product: true },
            orderBy: { created_at: 'desc' }
        });

        return res.status(200).json({
            message: "User Wishlists retrieved successfully!!!",
            wishlists,
            metadata: {
                page: pageNum,
                limit: limitNum,
                totalCount,
                totalPages: Math.ceil(totalCount / limitNum),
            }
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const getUserWishlist = async(req: express.Request, res: express.Response) => {
    try {
        const id = String(req?.params?.id);
        
        const product = await prisma.wishlists.findFirst({
            where: { 
                id: Array.isArray(id) ? id[0] : id
            },
            include: { product: true }
        });

        return res.status(200).json({
            message: "User Wishlist retrieved successfully!!!",
            product
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

