import redis from "../lib/redis.ts";
import { fetchProduct } from "./productServices.ts";


export const fetchCart = async (key: string) => {
    
    const items = await redis.hgetall(key);

    const parsed = Object.values(items).map(item => JSON.parse(item));

    const total = parsed.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    return {
        items: parsed,
        total
    }
}

export const storeCart = async (key: string, productId: string, quantity: number) => {

    const product = await fetchProduct(productId);

    const existing = await redis.hget(key, productId);

    if (existing) {
        const item = JSON.parse(existing);
        item.quantity += quantity;
        await redis.hset(key, productId, JSON.stringify(item));
    } else {
        await redis.hset(key, productId, JSON.stringify({
            productId,
            quantity,
            price: product?.price
        }));
    }

    const items = await redis.hgetall(key);

    await redis.expire(key, 60 * 60 * 24); // TTL

}

export const modifyCartItems = async (key: string, productId: string, quantity: number) => {
    
    const existing = await redis.hget(key, productId);

    if (!existing) {
        const errorDetails = {
            message: "Item not found",
            hasError: true
        }
        return { err: errorDetails };
    }

    const item = JSON.parse(existing);

    item.quantity = quantity;

    await redis.hset(key, String(productId), JSON.stringify(item));

    return await fetchCart(key)
}