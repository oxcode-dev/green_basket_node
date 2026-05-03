import redis from "../lib/redis.ts";
import { type CartType, type CartItemsType } from "../types/index.ts";
import { fetchProduct } from "./productServices.ts";


export const fetchCart = async (key: string) => {
    
    const items = await redis.hgetall(key);

    const parsed: CartItemsType[] = Object.values(items).map(item => JSON.parse(item));

    const total = parsed.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    return {
        items: parsed,
        total
    } as CartType
}

export const storeCart = async (key: string, productId: string, quantity: number) => {

    const product = await fetchProduct(productId);

    const existing = await redis.hget(key, productId);

    if (existing) {
        const item : CartItemsType = JSON.parse(existing);
        item.quantity += quantity;
        await redis.hset(key, productId, JSON.stringify(item));
    } else {
        await redis.hset(key, productId, JSON.stringify({
            productId,
            quantity,
            price: Number(product?.price)
        }));
    }

    await redis.expire(key, 60 * 60 * 24); // TTL

    return await fetchCart(key)
}

export const modifyCartItems = async (key: string, productId: string, quantity: number) => {
    
    const existing = await fetchCartItem(key, productId);

    if(existing) {
        const item: CartItemsType = JSON.parse(existing);

        item.quantity = quantity;

        await redis.hset(key, productId, JSON.stringify(item));
    }

    return await fetchCart(key)
}

export const fetchCartItem = async(key: string, productId: string) => {
    return await redis.hget(key, productId);
}

export const deleteCartItem = async(key: string, productId: string) => {
    await redis.hdel(key, String(productId));

    return await fetchCart(key)
}

export const deleteCart = async (key: string) => {
    await redis.del(key);

    return await fetchCart(key)
}