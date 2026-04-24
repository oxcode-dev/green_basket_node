import { prisma } from "../lib/prisma.ts"
import type { ProductType } from "../types/index.ts";

export const fetchAllOrders = async () => {
    return await prisma.orders.findMany();
}

export const fetchOrder = async (id: string) => {
    return await prisma.orders.findFirst({
        where: { 
            id: String(Array.isArray(id) ? id[0] : id)
        },
        include: { order_items: true }
    });
}

export const fetchOrdersWithPagination = async(skip: number, limit: number) => {
    return await prisma.orders.findMany({
        skip: skip,
        take: limit,
        include: { order_items: true },
        orderBy: { created_at: 'desc' }
    });
}

export const countAllOrders = async () => {
    return await prisma.orders.count();
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

export const destroyOrder = async(id: string) => {
    await prisma.orders.delete({
        where: { id: id },
    })
}