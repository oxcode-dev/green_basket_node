import express from 'express';
import { prisma } from '../lib/prisma.ts';

export const getProducts = async(req: express.Request, res: express.Response) => {
    try {

        const { page = 1, limit = 1 } = req.query as {page?: string | number, limit?: string | number};
        const pageNum = typeof page === 'string' ? parseInt(page) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
        const skip = (pageNum - 1) * limitNum;
        
        const totalCount = await prisma.products.count();

        const products = await prisma.products.findMany({
            skip: Number(skip),
            take: Number(limit),
            include: { category: true },
            orderBy: { created_at: 'desc' }
        });

        return res.status(200).json({
            message: "Products retrieved successfully!!!",
            products,
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

export const getProduct = async(req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        
        const product = await prisma.products.findFirst({
            where: { 
                id: String(Array.isArray(id) ? id[0] : id)
            },
            include: { category: true }
        });

        return res.status(200).json({
            message: "Product retrieved successfully!!!",
            product
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const getProductsByCategory = async(req: express.Request, res: express.Response) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 1 } = req.query as {page?: string | number, limit?: string | number};
        const pageNum = typeof page === 'string' ? parseInt(page) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
        const skip = (pageNum - 1) * limitNum;
        
        const totalCount = await prisma.products.count({
            where: {
                category_id: String(category),
            }
        });

        const products = await prisma.products.findMany({
            skip: Number(skip),
            take: Number(limitNum),
            where: {
                category_id: String(category),
            },
            include: { category: true },
            orderBy: { created_at: 'desc' }
        });

        return res.status(200).json({
            message: "Products retrieved successfully!!!",
            products,
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