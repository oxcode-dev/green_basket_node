import redis from "../lib/redis.ts";


const fetchCart = async (key: string) => {
    
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