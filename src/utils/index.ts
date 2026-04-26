// import type { Request } from "express";
export const getCartKey = (req: any) => {
    if (req.user) {
        return `cart:user:${req.user.id}`;
    }
    return `cart:guest:${req.session.id}`;
};