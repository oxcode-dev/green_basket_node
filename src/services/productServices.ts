import { prisma } from "../lib/prisma.ts"
import type { ProductType } from "../types/index.ts";

export const fetchAllProducts = async () => {
    return await prisma.products.findMany();
}

export const fetchProduct = async (id: string) => {
    return await prisma.products.findFirst({
        where: { 
            id: String(Array.isArray(id) ? id[0] : id)
        },
        include: { category: true }
    });
}

export const fetchProductsWithPagination = async(skip: number, limit: number) => {
    return await prisma.products.findMany({
        skip: skip,
        take: limit,
        include: { category: true },
        orderBy: { created_at: 'desc' }
    });
}

export const countAllProducts = async () => {
    return await prisma.products.count();
}

export const storeProduct = async (productData: Omit<ProductType, "id">) => {
    const product = await prisma.products.create({
        data: productData,
    })

    return product;
} 

export const updateProduct = async (id: string, productData: Omit<ProductType, "id">) => {
    const product = await prisma.products.update({
        where: { id: id },
        data: productData,
    })

    return product;
} 

export const destroyProduct = async(id: string) => {
    await prisma.products.delete({
        where: { id: id },
    })
}