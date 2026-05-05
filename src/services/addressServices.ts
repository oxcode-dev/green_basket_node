import { slugify } from "../helpers/index.ts"
import { prisma } from "../lib/prisma.ts"

export const fetchAddresses = async () => {
    return await prisma.addresses.findMany();
}

export const fetchUserAddresses = async (userId: string) => {
    return await prisma.addresses.findMany({
        where: { user_id: userId},
        include: { user: false },
        // omit: ["user.password"],
        orderBy: { created_at: 'desc' },
    });
}

export const fetchAddress = async (id: string) => {
    return await prisma.addresses.findFirst({
        where: { id: id },
        include: { user: true }
    });
}

export const storeAddress = async (name: string, description?: string) => {
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

export const destroyCategory = async(id: string) => {
    await prisma.addresses.delete({
        where: { id: id },
    })
}