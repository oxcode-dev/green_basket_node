import { slugify } from "../helpers/index.ts"
import { Category } from "../models/index.ts";

export const fetchCategories = async () => {
    return await Category.findMany();
}

export const fetchCategory = async (id: string) => {
    return await Category.findFirst({
        where: { 
            id: String(Array.isArray(id) ? id[0] : id)
        },
        include: { products: true }
    });
}

export const storeCategory = async (name: string, description?: string) => {
    let data = {
        name: name,
        slug: slugify(name),
        description: description || '',
    };

    const category = await Category.create({
        data: data,
    })

    return category;
} 

export const updateCategory = async (id: string, name: string, description?: string) => {
    let data = {
        name: name,
        slug: slugify(name),
        description: description || '',
    };

    const category = await Category.update({
        where: { id: id },
        data: data,
    })

    return category;
} 

export const destroyCategory = async(id: string) => {
    await Category.delete({
        where: { id: id },
    })
}