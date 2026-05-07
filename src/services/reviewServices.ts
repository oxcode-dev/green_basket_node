import { Review } from "../models/index.ts";
import type { ReviewType } from "../types/index.ts";

export const fetchReviews = async () => {
    return await Review.findMany();
}

export const fetchUserReviews = async (userId: string) => {
    return await Review.findMany({
        where: { user_id: userId},
        include: { 
            product: true,
        },
        orderBy: { created_at: 'desc' },
    });
}

export const fetchUserReviewsWithPagination = async(userId: string, skip: number, limit: number) => {
    return await Review.findMany({
        skip: skip,
        take: limit,
        include: { product: true },
        where: { user_id: userId},
        orderBy: { created_at: 'desc' }
    });
}

export const countUserReviews = async (userId: string) => {
    return await Review.count({
        where: { user_id: userId},
    });
}

export const fetchReview = async (id: string) => {
    return await Review.findFirst({
        where: { id: id },
        include: { product: true }
    });
}

export const storeReview = async (data: Omit<ReviewType, "id">) => {
    const review = await Review.create({
        data: data,
    })

    return review;
} 

export const destroyReview = async(id: string) => {
    await Review.delete({
        where: { id: id },
    })
}