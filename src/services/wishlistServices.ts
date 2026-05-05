import { prisma } from "../lib/prisma.ts"
import type { AddressType } from "../types/index.ts";

export const fetchWishlists = async () => {
    return await prisma.wishlists.findMany();
}

export const fetchUserWishlists = async (userId: string) => {
    return await prisma.wishlists.findMany({
        where: { user_id: userId},
        include: { user: false },
        // omit: ["user.password"],
        orderBy: { created_at: 'desc' },
    });
}

export const countUserWishlists = async (userId: string) => {
    return await prisma.wishlists.count({
        where: { user_id: userId},
    });
}

export const fetchWishlist = async (id: string) => {
    return await prisma.wishlists.findFirst({
        where: { id: id },
        include: { user: true }
    });
}

export const storeWishlist = async (data: Omit<AddressType, "id">) => {
    const wishlist = await prisma.wishlists.create({
        data: data,
    })

    return wishlist;
} 

export const updateWishlist = async (id: string, data: Partial<AddressType>) => {
    const wishlist = await prisma.wishlists.update({
        where: { id: id },
        data: data,
    })

    return wishlist;
} 

export const destroyWishlist = async(id: string) => {
    await prisma.wishlists.delete({
        where: { id: id },
    })
}