import express from 'express';
import { prisma } from '../lib/prisma.ts';


export const getUserOrders = async (req: express.Request, res: express.Response) => {
    try {
        const auth = req.user

        const { page = 1, limit = 1 } = req.query as {page?: string | number, limit?: string | number};
        const pageNum = typeof page === 'string' ? parseInt(page) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
        const skip = (pageNum - 1) * limitNum;
        
        const totalCount = await prisma.orders.count();

        const orders = await prisma.orders.findMany({
            skip: Number(skip),
            take: Number(limit),
            include: { order_items: true },
            orderBy: { created_at: 'desc' },
            where: { user_id: auth?.id}
        });

        let data = {
            status: "success",
            message: "Orders fetched successfully",
            orders,
            metadata: {
                page: pageNum,
                limit: limitNum,
                totalCount,
                totalPages: Math.ceil(totalCount / limitNum),
            }
        }

        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const getUserOrder = async (req: express.Request, res: express.Response) => {
    try {
        const auth: string = req?.user;
        const { id } = req?.params;

        const ids: string = req?.params?.id || ''
        
        const order = await prisma.orders.findMany({
            include: { order_items: true },
            where: { user_id: auth?.id, id: ids}
        });

        let data = {
            status: "success",
            message: "Orders fetched successfully",
            order,
        }

        res.status(200).json(data);
        
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}