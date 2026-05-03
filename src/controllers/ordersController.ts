import express from 'express';
import { prisma } from '../lib/prisma.ts';
import type { PaginationType } from '../types/index.ts';
import { countAllCustomerOrders, countAllOrders, fetchCustomerOrdersWithPagination, fetchOrder, fetchOrdersWithPagination, storeOrder } from '../services/OrderServices.ts';
import { fetchCart } from '../services/cartServices.ts';
import { getCartKey } from '../utils/index.ts';

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

        const key = getCartKey(req)

        const userId = req.user.id;

        const { address_id  } = req.body

        // 1. Get user cart
        // const cart = await Cart.findOne({ user: userId }).populate("items.product");
        const cart = await fetchCart(key)

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 2. Calculate total
        const totalAmount = cart?.total || 0
        // const totalAmount = cart.items.reduce((acc, item) => {
        //     return acc + item.product.price * item.quantity;
        // }, 0);

        // 3. Create order (PENDING)
        // const order = await Order.create({
        //     user: userId,
        //     // items: cart.items.map(item => ({
        //     //     product: item.product._id,
        //     //     quantity: item.quantity,
        //     //     price: item.product.price
        //     // })),
        //     totalAmount
        // });

        const order = await storeOrder({
            user_id: userId,
            address_id: address_id,
            total_amount: totalAmount,
            delivery_cost: 800,
            status: 'pending', 
            payment_method: 'none',
            payment_status: 'unpaid'
        });

        // 4. Initialize Paystack payment
        const paystackRes = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: req.user.email,
                amount: totalAmount * 100,
                callback_url: `${process.env.BASE_URL}/api/payment/verify`,
                metadata: {
                    orderId: order.id
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        // 5. Save reference
        // order.paymentReference = paystackRes.data.data.reference;
        // await order.save();

        // 6. Return payment link
        res.json({
            paymentUrl: paystackRes.data.data.authorization_url,
            orderId: order.id
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}


// exports.verifyPayment = async (req, res) => {
//   const { reference } = req.query;

//   const response = await axios.get(
//     `https://api.paystack.co/transaction/verify/${reference}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
//       }
//     }
//   );

//   const data = response.data.data;

//   if (data.status === "success") {
//     const order = await Order.findOne({ paymentReference: reference });

//     if (!order) return res.status(404).json({ message: "Order not found" });

//     order.paymentStatus = "paid";
//     order.status = "paid";
//     await order.save();

//     return res.json({ message: "Payment successful" });
//   }

//   res.status(400).json({ message: "Payment failed" });
// };


// const crypto = require("crypto");
// const Order = require("../models/Order");

// exports.paystackWebhook = async (req, res) => {
//   const hash = crypto
//     .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
//     .update(JSON.stringify(req.body))
//     .digest("hex");

//   if (hash !== req.headers["x-paystack-signature"]) {
//     return res.sendStatus(400);
//   }

//   const event = req.body;

//   if (event.event === "charge.success") {
//     const payment = event.data;

//     const order = await Order.findOne({
//       paymentReference: payment.reference
//     });

//     if (!order) return res.sendStatus(200);

//     // Prevent double processing
//     if (order.paymentStatus === "paid") return res.sendStatus(200);

//     order.paymentStatus = "paid";
//     order.status = "paid";
//     await order.save();

//     // OPTIONAL: clear cart
//     await Cart.findOneAndDelete({ user: order.user });

//     console.log("✅ Order paid:", order._id);
//   }

//   res.sendStatus(200);
// };