import express from 'express';
import { prisma } from '../lib/prisma.ts';
import { countAllProducts, destroyProduct, fetchProduct, fetchProductsWithPagination, storeProduct, updateProduct } from '../services/productServices.ts';
import { slugify } from '../helpers/index.ts';

export const getProducts = async(req: express.Request, res: express.Response) => {
    try {
        const { page, limit, skip } = req as { page: number, limit: number, skip: number}

        // const { page = 1, limit = 1 } = req.query as {page?: string | number, limit?: string | number};
        // const pageNum = typeof page === 'string' ? parseInt(page) : page;
        // const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
        // const skip = (pageNum - 1) * limitNum;
        
        const totalCount = await countAllProducts();

        const products = await fetchProductsWithPagination(skip, limit);

        return res.status(200).json({
            message: "Products retrieved successfully!!!",
            products,
            metadata: {
                page: page,
                limit: limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            }
        })
        
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const getProduct = async(req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        
        const product = await fetchProduct(String(id))

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

export const createProduct = async (req: express.Request, res: express.Response) => {
    try {
        const { title, description, price, stock, is_active, image, category_id } = req.body;
        
        const product = await storeProduct(
            { 
                title: title, 
                slug: slugify(title), 
                summary: '', 
                description, 
                price: Number(price), 
                stock: Number(stock), 
                is_active: Boolean(is_active), 
                image: image || '', 
                category_id: category_id
            }
        );

        return res.status(201).json({
            message: "Product created successfully!!!",
            product
        })
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const editProduct = async (req: express.Request, res: express.Response) => {
    try {
        const { title, description, price, stock, is_active, image, category_id } = req.body;
        const { id } = req.params; 
        
        const product = await updateProduct(String(id), { 
            title: title, 
            slug: slugify(title), 
            summary: '', 
            description, 
            price: Number(price), 
            stock: Number(stock), 
            is_active: Boolean(is_active), 
            image: image || '', 
            category_id: category_id
        });

        return res.status(201).json({
            message: "Product updated successfully!!!",
            product
        })
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}

export const deleteProduct = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params; 
        
        await destroyProduct(String(id));

        return res.status(201).json({
            message: "Product deleted successfully!!!",
        })
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
}