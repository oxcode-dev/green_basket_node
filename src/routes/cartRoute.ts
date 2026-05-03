import express from 'express';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.ts';
import { checkAuthForCart } from '../middlewares/handleCart.ts';


const router = express.Router();

router.route('/')
    .post(checkAuthForCart, addToCart)
    .get(checkAuthForCart, getCart)
    .delete(checkAuthForCart, clearCart);

router.route('/:productId')
    .put(checkAuthForCart, updateCartItem)
    .delete(checkAuthForCart, removeCartItem)


export { router as cartRoute };