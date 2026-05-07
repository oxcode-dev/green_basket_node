import express from 'express';
import type { PaginationType, RequestWithUser } from '../types/index.ts';
import { countUserWishlists, destroyWishlist, fetchUserWishlistsWithPagination, fetchWishlist, storeWishlist } from '../services/wishlistServices.ts';
import { fetchProduct } from '../services/productServices.ts';

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

        const wishlist = await fetchWishlist(id)

        if (!wishlist) {
            return res.status(404).json({ error: 'Wishlist not found' })
        }

        return res.status(200).json({
            message: "User Wishlist retrieved successfully!!!",
            wishlist
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const createWishlist = async (req: RequestWithUser, res: express.Response) => {
    try {
        const auth = req.user

        const product_id = String(req?.params?.product_id);

        if (!await fetchProduct(product_id)) {
            return res.status(404).json({ error: 'Product not found' })
        }

        const wishlist = await storeWishlist({
            product_id: product_id,
            user_id: String(auth?.id),
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

        if (!await fetchWishlist(id)) {
            return res.status(404).json({ error: 'Wishlist not found' })
        }

        await destroyWishlist(id);

        return res.status(201).json({
            message: 'Wishlist Deleted successfully', 
            status: 'success'
        });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}
