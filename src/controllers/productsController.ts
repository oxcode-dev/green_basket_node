import express from 'express';
import { countAllProducts, countProductsWithCategory, destroyProduct, fetchProduct, fetchProductsWithCategoryPagination, fetchProductsWithPagination, storeProduct, updateProduct } from '../services/productServices.ts';
import { slugify } from '../helpers/index.ts';
import type { PaginationType } from '../types/index.ts';

export const getProducts = async(req: express.Request | PaginationType, res: express.Response) => {
    const { page, limit, skip } = req as PaginationType;
    
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
}

export const getProduct = async(req: express.Request, res: express.Response) => {
    const { id } = req.params;
    
    const product = await fetchProduct(String(id))

    if (!product) {
        return res.status(404).json({ error: 'Product not found' })
    }

    return res.status(200).json({
        message: "Product retrieved successfully!!!",
        product
    })
}

export const getProductsByCategory = async(req: express.Request & PaginationType, res: express.Response) => {
    const { category } = req.params as { category: string };
    const { page, limit, skip } = req as PaginationType;

    
    const totalCount = await countProductsWithCategory(category);

    const products = await fetchProductsWithCategoryPagination(category, skip, limit);

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
}

export const createProduct = async (req: express.Request, res: express.Response) => {
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
}

export const editProduct = async (req: express.Request, res: express.Response) => {
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
}

export const deleteProduct = async (req: express.Request, res: express.Response) => {
    const { id } = req.params; 
    
    await destroyProduct(String(id));

    return res.status(201).json({
        message: "Product deleted successfully!!!",
    })
}