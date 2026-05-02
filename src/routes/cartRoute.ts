import express from 'express';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.ts';
import { checkAuthForCart } from '../middlewares/handleCart.ts';


const router = express.Router();

router.post('/', checkAuthForCart, addToCart);

router.get('/', checkAuthForCart, getCart);

router.delete('/clear', checkAuthForCart, clearCart)

router.put('/:productId', checkAuthForCart, updateCartItem);

router.delete('/:productId', checkAuthForCart, removeCartItem)



export { router as cartRoute };