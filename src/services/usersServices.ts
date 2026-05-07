import { User } from "../models/index.ts";
import type { UserType } from "../types/index.ts";

export const countAllUsers = async () => {
    return await User.count();
};

export const fetchAllUsers = async () => {
    return await User.findMany();
};

export const countUsersByRole = async (role: 'ADMIN' | 'CUSTOMER') => {
    return await User.count({
        where: {
            role: role,
        }
    });
};

export const fetchUsersByRoleWithPagination = async(skip: number, limit: number, role: 'ADMIN' | 'CUSTOMER') => {
    return await User.findMany({
        skip: skip,
        take: limit,
        where: { role: role },
        orderBy: { created_at: 'desc' }
    });
}

export const fetchUser = async (id: string) => {
    return await User.findFirst({
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

export const fetchUserByEmail = async (email: string) => {
    return await User.findFirst({
        where: { 
            email: email,
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
    const user = await User.create({
        data: userData,
    })

    return user;
} 

export const updateUser = async (id: string, userData: Omit<UserType, 'password'>) => {
    const user = await User.update({
        where: { id: id },
        data: userData,
    })

    return user;
} 

export const updateUserPassword = async (id: string, userData: Pick<UserType, 'password'>) => {
    const user = await User.update({
        where: { id: id },
        data: userData,
    })

    return user;
} 

export const destroyUser = async(id: string) => {
    await User.delete({
        where: { id: id },
    })
}