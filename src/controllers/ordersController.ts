import express from 'express';
import { prisma } from '../lib/prisma.ts';
import type { PaginationType } from '../types/index.ts';
import { countAllCustomerOrders, countAllOrders, fetchCustomerOrdersWithPagination, fetchOrder, fetchOrdersWithPagination } from '../services/OrderServices.ts';

interface RequestWithUser extends express.Request {
    user: {
        id: string;
    } | null;
}

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

const checkout = async (req: any, res: express.Response) => {
    try {
        const axios = require("axios");
        const Order = require("../models/Order");
        const Cart = require("../models/Cart");


        const userId = req.user.id;

        // 1. Get user cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 2. Calculate total
        const totalAmount = 0
        // const totalAmount = cart.items.reduce((acc, item) => {
        //     return acc + item.product.price * item.quantity;
        // }, 0);

        // 3. Create order (PENDING)
        const order = await Order.create({
            user: userId,
            // items: cart.items.map(item => ({
            //     product: item.product._id,
            //     quantity: item.quantity,
            //     price: item.product.price
            // })),
            totalAmount
        });

        // 4. Initialize Paystack payment
        const paystackRes = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: req.user.email,
                amount: totalAmount * 100,
                callback_url: `${process.env.BASE_URL}/api/payment/verify`,
                metadata: {
                orderId: order._id
                }
            },
            {
                headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        // 5. Save reference
        order.paymentReference = paystackRes.data.data.reference;
        await order.save();

        // 6. Return payment link
        res.json({
            paymentUrl: paystackRes.data.data.authorization_url,
            orderId: order._id
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}