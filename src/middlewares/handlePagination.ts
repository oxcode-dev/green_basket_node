import express from 'express';
import type { PaginationType } from '../types/index.ts';

const handlePagination = async (req: express.Request & PaginationType, res: express.Response, next: express.NextFunction)  => {
    let { page = 1, limit = 1 } = req.query as {page?: string | number, limit?: string | number};
    
    if (Number(page) < 1) page = 1

    const skip = (Number(page) - 1) * Number(limit);

    req.limit = Number(limit);
    req.skip = skip;
    req.page = Number(page);
    
    next();
}

export { handlePagination };