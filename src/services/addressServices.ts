import { prisma } from "../lib/prisma.ts"
import { Address } from "../models/index.ts";
import type { AddressType } from "../types/index.ts";

export const fetchAddresses = async () => {
    return await Address.findMany();
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

export const storeAddress = async (data: Omit<AddressType, "id">) => {
    const address = await prisma.addresses.create({
        data: data,
    })

    return address;
} 

export const updateAddress = async (id: string, data: Partial<AddressType>) => {
    const address = await prisma.addresses.update({
        where: { id: id },
        data: data,
    })

    return address;
} 

export const destroyAddress = async(id: string) => {
    await prisma.addresses.delete({
        where: { id: id },
    })
}