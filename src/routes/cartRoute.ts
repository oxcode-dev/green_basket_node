import express from 'express';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.ts';
import { checkAuthForCart } from '../middlewares/handleCart.ts';


const router = express.Router();

router.route('/')
    .post(checkAuthForCart as any, addToCart)
    .get(checkAuthForCart as any, getCart)
    .delete(checkAuthForCart as any, clearCart);

router.route('/:productId')
    .put(checkAuthForCart as any, updateCartItem)
    .delete(checkAuthForCart as any, removeCartItem)


export { router as cartRoute };