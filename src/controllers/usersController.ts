import express from 'express';
import type { PaginationType } from '../types/index.ts';
import { prisma } from '../lib/prisma.ts';
import { countUsersByRole, fetchUsersByRoleWithPagination } from '../services/usersServices.ts';

export const getAdminUsers = async (req: express.Request | PaginationType, res: express.Response) => {
    try {
        const { page, limit, skip } = req as PaginationType;
                
        const totalCount = await countUsersByRole('ADMIN');

        const users = await fetchUsersByRoleWithPagination(skip, limit, 'ADMIN');

        return res.status(200).json({
            message: "Admin users fetched successfully!!!",
            users,
            metadata: {
                page: page,
                limit: limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            }
        })
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const getCustomerUsers = async (req: express.Request | PaginationType, res: express.Response) => {
    try {
        const { page, limit, skip } = req as PaginationType;
                
        const totalCount = await countUsersByRole('CUSTOMER');

        const users = await fetchUsersByRoleWithPagination(skip, limit, 'CUSTOMER');

        return res.status(200).json({
            message: "Customer users fetched successfully!!!",
            users,
            metadata: {
                page: page,
                limit: limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            }
        })
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}