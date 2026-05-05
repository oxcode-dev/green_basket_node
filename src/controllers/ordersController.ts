import express from 'express';
import type { PaginationType, RequestWithUser } from '../types/index.ts';
import { countAllCustomerOrders, countAllOrders, fetchCustomerOrdersWithPagination, fetchOrder, fetchOrdersWithPagination } from '../services/OrderServices.ts';


export const getUserOrders = async (req: RequestWithUser & PaginationType, res: express.Response) => {
    try {
        const auth = req.user

        const { page, limit, skip } = req as PaginationType;
        
        const totalCount = await countAllCustomerOrders(String(auth?.id));

        const orders = await fetchCustomerOrdersWithPagination(String(auth?.id), skip, limit);

        let data = {
            status: "success",
            message: "Orders fetched successfully",
            orders,
            metadata: {
                page: page,
                limit: limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            }
        }

        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}

export const getOrder = async (req: RequestWithUser, res: express.Response) => {
    try {
        const auth = req.user

        const id = String(req?.params?.id || '')
        
        const order = await fetchOrder(id);

        if (!order || order.user_id !== auth?.id) {
            return res.status(404).json({ error: 'Order not found' })
        }

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

export const getAllOrders = async (req: express.Request & PaginationType, res: express.Response) => {
    try {
        const { page, limit, skip } = req as PaginationType;
        
        const totalCount = await countAllOrders();

        const orders = await fetchOrdersWithPagination(skip, limit);

        let data = {
            status: "success",
            message: "Orders fetched successfully",
            orders,
            metadata: {
                page: page,
                limit: limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            }
        }

        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: `server error: ${error}`})
    }
}