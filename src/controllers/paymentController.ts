import express from 'express';
import { prisma } from '../lib/prisma.ts';
import { fetchCart } from '../services/cartServices.ts';
import { getCartKey } from '../utils/index.ts';
import axios from 'axios';
import { storeOrder, storeOrderItem, updateOrder } from '../services/OrderServices.ts';

interface RequestWithUser extends express.Request {
    user: {
        id: string;
    } | null;
}

export const checkout = async (req: any, res: express.Response) => {
    try {
        const key = getCartKey(req)

        const userId = req.user.id;

        const { address_id  } = req.body

        // 1. Get user cart
        const cart = await fetchCart(key)

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 2. Calculate total
        const totalAmount = cart?.total || 0
        // const totalAmount = cart.items.reduce((acc, item) => {
        //     return acc + item.product.price * item.quantity;
        // }, 0);

        const order = await storeOrder({
            user_id: userId,
            address_id: address_id,
            total_amount: totalAmount,
            delivery_cost: 800,
            status: 'pending', 
            payment_method: 'none',
            payment_status: 'unpaid',
            payment_reference: '',
        });

        cart.items.map(async (item, key) => {
            await storeOrderItem({
                order_id: order.id,
                product_id: item?.productId,
                quantity: item?.quantity || 0,
                unit_price: item?.price || 0
            })
        })

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
        await updateOrder(order.id, {
            payment_reference: paystackRes.data.data.reference,
        });

        // 6. Return payment link
        res.status(201).json({
            paymentUrl: paystackRes.data.data.authorization_url,
            orderId: order.id
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}


export const verifyPayment = async (req: express.Request, res: express.Response) => {
    try {
        const { reference } = req.query as { reference: string};

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const data = response.data.data;

        if (data.status === "success") {
            const order = await prisma.orders.findFirst({
                where: { 
                    payment_reference: reference
                },
                include: { order_items: true }
            });
            
            if (!order) return res.status(404).json({ message: "Order not found" });

            await updateOrder(order.id, {
                payment_status: "paid",
                status: "paid",
            });

            return res.json({ message: "Payment successful" });
        }

        res.status(400).json({ message: "Payment failed" });
        
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};


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