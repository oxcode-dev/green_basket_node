import { Product } from "../models/index.ts";
import type { ProductType } from "../types/index.ts";

export const fetchAllProducts = async () => {
    return await Product.findMany();
}

export const fetchProduct = async (id: string) => {
    return await Product.findFirst({
        where: { 
            id: id,
        },
        include: { category: true }
    });
}

export const fetchProductsWithPagination = async(skip: number, limit: number) => {
    return await Product.findMany({
        skip: skip,
        take: limit,
        include: { category: true },
        orderBy: { created_at: 'desc' }
    });
}

export const countAllProducts = async () => {
    return await Product.count();
}

export const storeProduct = async (productData: Omit<ProductType, "id">) => {
    const product = await Product.create({
        data: productData,
    })

    return product;
} 

export const updateProduct = async (id: string, productData: Omit<ProductType, "id">) => {
    const product = await Product.update({
        where: { id: id },
        data: productData,
    })

    return product;
} 

export const destroyProduct = async(id: string) => {
    await Product.delete({
        where: { id: id },
    })
}