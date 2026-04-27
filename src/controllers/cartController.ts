import express from 'express';
import { getCartKey } from '../utils/index.ts';
import { prisma } from '../lib/prisma.ts';
import redis from '../lib/redis.ts';


export const addToCart = async(req: express.Request, res: express.Response) => {
    const { productId, quantity = 1 }: { productId: string, quantity: number } = req.body;

    const key = getCartKey(req);

    const product = await prisma.products.findUnique({ where: { id: productId } });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const existing = await redis.hget(key, productId);

    if (existing) {
        const item = JSON.parse(existing);
        item.quantity += quantity;
        await redis.hset(key, productId, JSON.stringify(item));
    } else {
        await redis.hset(key, productId, JSON.stringify({
            productId,
            quantity,
            price: product.price
        }));
    }

    const items = await redis.hgetall(key);

    await redis.expire(key, 60 * 60 * 24); // TTL

    return res.status(200).json({ message: 'Added to cart', cart: items, session: JSON.stringify(req.session.id), key });
}

export const getCart = async(req: express.Request, res: express.Response) => {
    const key = getCartKey(req);
    
    const items = await redis.hgetall(key);

    const parsed = Object.values(items).map(item => JSON.parse(item));

    const total = parsed.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    await redis.flushall();

    res.json({ items: parsed, total });
}