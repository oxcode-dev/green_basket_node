import { Wishlist } from "../models/index.ts";
import type { WishlistType } from "../types/index.ts";

export const fetchWishlists = async () => {
    return await Wishlist.findMany();
}

export const fetchUserWishlists = async (userId: string) => {
    return await Wishlist.findMany({
        where: { user_id: userId},
        include: { product: true },
        // omit: ["user.password"],
        orderBy: { created_at: 'desc' },
    });
}

export const fetchUserWishlistsWithPagination = async(userId: string, skip: number, limit: number) => {
    return await Wishlist.findMany({
        skip: skip,
        take: limit,
        include: { product: true },
        where: { user_id: userId},
        orderBy: { created_at: 'desc' }
    });
}

export const countUserWishlists = async (userId: string) => {
    return await Wishlist.count({
        where: { user_id: userId},
    });
}

export const fetchWishlist = async (id: string) => {
    return await Wishlist.findFirst({
        where: { id: id },
        include: { product: true }
    });
}

export const storeWishlist = async (data: Omit<WishlistType, "id">) => {
    const wishlist = await Wishlist.create({
        data: data,
    })

    return wishlist;
} 

export const destroyWishlist = async(id: string) => {
    await Wishlist.delete({
        where: { id: id },
    })
}