import { prisma } from "../lib/prisma.ts";

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