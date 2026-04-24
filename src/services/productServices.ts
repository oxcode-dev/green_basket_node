import { title } from "node:process";
import { slugify } from "../helpers/index.ts"
import { prisma } from "../lib/prisma.ts"

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

export const storeProduct = async (title: string, description?: string) => {
    let data = {
        title: title,
        slug: slugify(title),
        description: description || '',
    };

    const product = await prisma.products.create({
        data: data,
    })

    return product;
} 

export const updateProduct = async (id: string, name: string, description?: string) => {
    let data = {
        name: name,
        slug: slugify(name),
        description: description || '',
    };

    const product = await prisma.products.update({
        where: { id: id },
        data: data,
    })

    return product;
} 

export const destroyProduct = async(id: string) => {
    await prisma.products.delete({
        where: { id: id },
    })
}