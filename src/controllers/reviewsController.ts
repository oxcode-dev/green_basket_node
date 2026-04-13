import express from 'express';
import { prisma } from '../lib/prisma.ts';

export const getReviews = async(req: express.Request, res: express.Response) => {
    try {
        const auth: {id: string, email: string} = req?.user;

        const { page = 1, limit = 1 } = req.query as {page?: string | number, limit?: string | number};
        const pageNum = typeof page === 'string' ? parseInt(page) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
        const skip = (pageNum - 1) * limitNum;
        
        const totalCount = await prisma.reviews.count();

        const reviews = await prisma.reviews.findMany({
            skip: Number(skip),
            take: Number(limit),
            where: { user_id: auth?.id},
            include: { product: true },
            orderBy: { created_at: 'desc' }
        });

        return res.status(200).json({
            message: "Reviews retrieved successfully!!!",
            reviews,
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

export const getReview = async(req: express.Request, res: express.Response) => {
    try {
        const id = String(req?.params?.id);
        
        const review = await prisma.reviews.findFirst({
            where: { 
                id: Array.isArray(id) ? id[0] : id
            },
            include: { product: true }
        });

        return res.status(200).json({
            message: "User Wishlist retrieved successfully!!!",
            review
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const storeWishlist = async (req: express.Request, res: express.Response) => {
    try {
        const auth: {id: string, email: string} = req?.user;

        const product_id = String(req?.params?.id);

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

export const deleteWishlist = async (req: express.Request, res: express.Response) => {
    try {
        const id = String(req?.params?.id)
        if (!await prisma.reviews.findUnique({ where: { id: id } })) {
            return res.status(404).json({ error: 'Review not found' })
        }

        const address = await prisma.reviews.delete({
            where: { id: id }
        })

        return res.status(201).json({
            message: 'Review Deleted successfully', 
            address,
            status: 'success'
        });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}
