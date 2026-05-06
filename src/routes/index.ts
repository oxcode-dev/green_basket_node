import express from 'express';
import { ProductsRoute } from './productsRoute.ts';
import { profileRoute } from "./profileRoute .ts";
import { ordersRoute } from "./ordersRoute.ts";
import { addressesRoute } from "./addressesRoute.ts";
import { wishlistsRoute } from "./wishlistsRoute.ts";
import { reviewsRoute } from "./reviewsRoute.ts";
import { authRoute } from "./authRoute.ts";
import { passwordResetRoute } from "./passwordResetRoute.ts";
import { categoriesRoute } from "./categoriesRoute.ts";
import { cartRoute } from "./cartRoute.ts";
import { adminRoute } from "./adminRoute.ts";


const routes = (app: express.Application) => {
    app.use('/api/auth', authRoute)
    app.use('/api/password', passwordResetRoute)
    app.use('/api/categories', categoriesRoute)
    app.use('/api/products', ProductsRoute)
    app.use('/api/profile', profileRoute)
    app.use('/api/orders', ordersRoute)
    app.use('/api/addresses', addressesRoute)
    app.use('/api/wishlists', wishlistsRoute)
    app.use('/api/reviews', reviewsRoute)
    app.use('/api/admin', adminRoute)
    app.use('/api/cart', cartRoute)
}

export default routes