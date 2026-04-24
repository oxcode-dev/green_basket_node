import { slugify } from "../helpers/index.ts"
import { prisma } from "../lib/prisma.ts"

export const storeCategory = async (name: string, description?: string) => {
    let data = {
        name: name,
        slug: slugify(name),
        description: description || '',
    };

    const category = await prisma.categories.create({
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

    const category = await prisma.categories.update({
        where: { id: id },
        data: data,
    })

    return category;
} 