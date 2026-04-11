import express from 'express';
import { prisma } from '../lib/prisma.ts';

export const getProducts = async(req: express.Request, res: express.Response) => {
    try {
        const products = await prisma.products.findMany();

        return res.status(200).json({
            message: "Products retrieved successfully!!!",
            products
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
                id: Array.isArray(id) ? id[0] : id
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

        const products = await prisma.products.findMany({
            // skip: skip,
            // take: take,
            where: {
                category_id: category,
            }
        });

        return res.status(200).json({
            message: "Products retrieved successfully!!!",
            products
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}