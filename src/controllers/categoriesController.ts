import express, {type Request} from 'express';
import { prisma } from '../lib/prisma.ts';

export const getCategories = async(req: express.Request, res: express.Response) => {
    try {
        const categories = await prisma.categories.findMany();

        return res.status(200).json({
            message: "Categories retrieved successfully!!!",
            categories
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const getCategory = async(req: Request, res: express.Response) => {
    try {
        const { id } = req.params;
        
        const category = await prisma.categories.findFirst({
            where: { 
                id: String(Array.isArray(id) ? id[0] : id)
            },
            include: { products: true }
        });

        return res.status(200).json({
            message: "Category retrieved successfully!!!",
            category
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}


export const createCategory = async (req: express.Request, res: express.Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const updateCategory = async (req: express.Request, res: express.Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const deleteCategory = async (req: express.Request, res: express.Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}