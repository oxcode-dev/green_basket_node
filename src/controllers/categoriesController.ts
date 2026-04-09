import express from 'express';
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