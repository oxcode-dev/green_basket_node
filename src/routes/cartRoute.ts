import express from 'express';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.ts';
import { checkAuthForCart } from '../middlewares/handleCart.ts';


const router = express.Router();

router.post('/', checkAuthForCart, addToCart);

router.get('/', checkAuthForCart, getCart);

router.put('/:productId', checkAuthForCart, updateCartItem);

router.delete('/:productId', checkAuthForCart, removeCartItem)

router.delete('/clear', clearCart)


export { router as cartRoute };