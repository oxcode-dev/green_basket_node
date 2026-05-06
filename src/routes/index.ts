import express from 'express';
import { ProductsRoute } from './productsRoute.ts';


const routes = (app: express.Application) => {
    app.use('/api/products', ProductsRoute)
}

export default routes