import express from 'express';
import type { PaginationType, RequestWithUser } from '../types/index.ts';
import { countUserReviews, destroyReview, fetchReview, fetchUserReviewsWithPagination, storeReview } from '../services/reviewServices.ts';
import { fetchProduct } from '../services/productServices.ts';

export const getReviews = async(req: RequestWithUser & PaginationType, res: express.Response) => {
    try {
        const auth = req?.user;

        const { page, limit, skip } = req as PaginationType;
        
        const totalCount = await countUserReviews(String(auth?.id))

        const reviews = await fetchUserReviewsWithPagination(String(auth?.id), skip, limit);

        return res.status(200).json({
            message: "Reviews retrieved successfully!!!",
            reviews,
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

export const getReview = async(req: express.Request, res: express.Response) => {
    try {
        const id = String(req?.params?.id);
        
        const review = await fetchReview(id);

        return res.status(200).json({
            message: "User review retrieved successfully!!!",
            review
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const createReview = async (req: RequestWithUser, res: express.Response) => {
    try {
        const auth = req?.user;

        const {rating, product_id, comment} = req.body;

        if (!await fetchProduct(product_id)) {
            return res.status(404).json({ error: 'Product not found' })
        }

        const review = await storeReview({
            product_id,
            rating: Number(rating),
            comment,
            user_id: String(auth?.id)
        })

        return res.status(200).json({
            message: "User review added successfully!!!",
            review
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
} 

export const deleteReview = async (req: express.Request, res: express.Response) => {
    try {
        const id = String(req?.params?.id)

        if (!await fetchReview(id)) {
            return res.status(404).json({ error: 'Review not found' })
        }

        await destroyReview(id)

        return res.status(201).json({
            message: 'Review Deleted successfully', 
            status: 'success'
        });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}
