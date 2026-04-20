import express from 'express';
import { prisma } from '../lib/prisma.ts';


export const getUserOrders = async (req: any, res: express.Response) => {
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

export const getUserOrder = async (req: any, res: express.Response) => {
    try {
        const auth: {id: string, email: string} = req?.user;

        const id: string = String(req?.params?.id || '')

        if (!await prisma.orders.findUnique({ where: { id: id } })) {
            return res.status(404).json({ error: 'Order not found' })
        }
        
        const order = await prisma.orders.findMany({
            include: { order_items: true },
            where: { user_id: auth?.id, id: id}
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