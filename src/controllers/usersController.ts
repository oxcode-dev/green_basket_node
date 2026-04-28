import express from 'express';
import { PaginationType } from '../types/index.ts';
import { prisma } from '../lib/prisma.ts';

export const getAdminUsers = async (req: express.Request | PaginationType, res: express.Response) => {
    try {
        const { page, limit, skip } = req as PaginationType;
                
        // const totalCount = await countAllProducts();
        const totalCount = await prisma.users.count({
            where: {
                role: 'ADMIN',
            }
        });

        // const products = await fetchProductsWithPagination(skip, limit);
        const users = await prisma.users.count({
            where: {
                role: 'ADMIN',
            }
        });

        return res.status(200).json({
            message: "Users retrieved successfully!!!",
            users,
            metadata: {
                page: page,
                limit: limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            }
        })
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}