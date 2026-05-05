import { prisma } from "../lib/prisma.ts";
import type { UserType } from "../types/index.ts";

export const countAllUsers = async () => {
    return await prisma.users.count();
};

export const fetchAllUsers = async () => {
    return await prisma.users.findMany();
};

export const countUsersByRole = async (role: 'ADMIN' | 'CUSTOMER') => {
    return await prisma.users.count({
        where: {
            role: role,
        }
    });
};

export const fetchUsersByRoleWithPagination = async(skip: number, limit: number, role: 'ADMIN' | 'CUSTOMER') => {
    return await prisma.users.findMany({
        skip: skip,
        take: limit,
        where: { role: role },
        orderBy: { created_at: 'desc' }
    });
}

export const fetchUser = async (id: string) => {
    return await prisma.users.findFirst({
        where: { 
            id: id,
        },
        include: { 
            orders: true,
            reviews: true,
            addresses: true,
            wishlists: true,
        }
    });
}

export const storeUser = async (userData: UserType) => {
    const user = await prisma.users.create({
        data: userData,
    })

    return user;
} 

export const updateUser = async (id: string, userData: Omit<UserType, 'password'>) => {
    const user = await prisma.users.update({
        where: { id: id },
        data: userData,
    })

    return user;
} 

export const updateUserPassword = async (id: string, userData: Pick<UserType, 'password'>) => {
    const user = await prisma.users.update({
        where: { id: id },
        data: userData,
    })

    return user;
} 

export const destroyUser = async(id: string) => {
    await prisma.users.delete({
        where: { id: id },
    })
}