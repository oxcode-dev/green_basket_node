import { prisma } from "../lib/prisma.ts"
import { ProductType } from "../types/index.ts";

export const fetchCategories = async () => {
    return await prisma.categories.findMany();
}

export const fetchCategory = async (id: string) => {
    return await prisma.categories.findFirst({
        where: { 
            id: String(Array.isArray(id) ? id[0] : id)
        },
        include: { products: true }
    });
}

export const storeProduct = async (productData: ProductType) => {
    const product = await prisma.products.create({
        data: productData,
    })

    return product;
} 

export const updateProduct = async (id: string, productData: ProductType) => {
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