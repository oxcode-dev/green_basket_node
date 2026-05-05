import { prisma } from "../lib/prisma.ts"
import type { ReviewType } from "../types/index.ts";

export const fetchReviews = async () => {
    return await prisma.reviews.findMany();
}

export const fetchUserReviews = async (userId: string) => {
    return await prisma.reviews.findMany({
        where: { user_id: userId},
        include: { 
            product: true,
            // user: {
            //     include: {
            //         first_name: true,
            //     }
            // }
        },
        orderBy: { created_at: 'desc' },
    });
}

export const fetchUserReviewsWithPagination = async(userId: string, skip: number, limit: number) => {
    return await prisma.reviews.findMany({
        skip: skip,
        take: limit,
        include: { product: true },
        where: { user_id: userId},
        orderBy: { created_at: 'desc' }
    });
}

export const countUserReviews = async (userId: string) => {
    return await prisma.reviews.count({
        where: { user_id: userId},
    });
}

export const fetchReview = async (id: string) => {
    return await prisma.reviews.findFirst({
        where: { id: id },
        include: { product: true }
    });
}

export const storeReview = async (data: Omit<ReviewType, "id">) => {
    const review = await prisma.reviews.create({
        data: data,
    })

    return review;
} 

export const destroyReview = async(id: string) => {
    await prisma.reviews.delete({
        where: { id: id },
    })
}