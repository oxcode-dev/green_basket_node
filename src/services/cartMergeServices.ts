import redis from "../lib/redis.ts";

export const mergeGuestCart = async (req: any, userId: string) => {
    const guestKey = `cart:guest:${req.session.id}`;
    const userKey = `cart:user:${userId}`;

    const guestItems = await redis.hgetall(guestKey);

    if (!guestItems || Object.keys(guestItems).length === 0) {
        return;
    }

    for (const productId in guestItems) {
        const guestItem = JSON.parse(guestItems[productId]);

        const existing = await redis.hget(userKey, productId);

        if (existing) {
            const userItem = JSON.parse(existing);
            userItem.quantity += guestItem.quantity;

            await redis.hset(userKey, productId, JSON.stringify(userItem));
        } else {
            await redis.hset(userKey, productId, JSON.stringify(guestItem));
        }
    }

    // delete guest cart after merge
    await redis.del(guestKey);
};