import express from "express";

export interface DataStoredInToken {
  id: string;
  email: string;
}

const handleCustomer = async (req: any, res: express.Response, next: express.NextFunction)  => {
    return req.user.role === 'CUSTOMER' ? next() : res.status(403).json({ message: 'Access denied: Customers only' });
}

const handleAdmin = async (req: any, res: express.Response, next: express.NextFunction)  => {
    return req.user.role === 'ADMIN' ? next() : res.status(403).json({ message: 'Access denied: Admins only' });
}

export { handleCustomer, handleAdmin };