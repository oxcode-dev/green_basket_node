import { prisma } from "../lib/prisma.ts";

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

const users = await prisma.users.findMany({
    where: {
        role: 'ADMIN',
    }
});