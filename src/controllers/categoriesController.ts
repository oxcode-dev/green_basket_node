import express, {type Request} from 'express';
import { prisma } from '../lib/prisma.ts';
import { destroyCategory, storeCategory, updateCategory } from '../services/categoryServices.ts';

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
        const { name, description } = req.body;

        const category = await storeCategory(name, description);

        return res.status(201).json({
            message: "Category created successfully!!!",
            category
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const editCategory = async (req: express.Request, res: express.Response) => {
    try {
        const { name, description } = req.body;

        const { id } = req.params; 

        const category = await updateCategory(String(id), name, description);

        return res.status(201).json({
            message: "Category updated successfully!!!",
            category
        })
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const deleteCategory = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params; 

        await destroyCategory(String(id));

        return res.status(201).json({
            message: "Category deleted successfully!!!",
        })
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}