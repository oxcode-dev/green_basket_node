import { slugify } from "../helpers/index.ts"
import { prisma } from "../lib/prisma.ts"
import { AddressType } from "../types/index.ts";

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

export const storeProduct = async (data: Omit<AddressType, "id">) => {
    const product = await prisma.addresses.create({
        data: data,
    })

    return product;
} 

export const updateProduct = async (id: string, data: Partial<AddressType>) => {
    const product = await prisma.addresses.update({
        where: { id: id },
        data: data,
    })

    return product;
} 

export const destroyCategory = async(id: string) => {
    await prisma.addresses.delete({
        where: { id: id },
    })
}