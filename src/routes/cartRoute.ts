import express from 'express';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.ts';
import { checkAuthForCart } from '../middlewares/handleCart.ts';


const router = express.Router();

router.post('/add', checkAuthForCart, addToCart);

router.get('/get', checkAuthForCart, getCart);

router.put('/update/:productId', checkAuthForCart, updateCartItem);

router.delete('/remove/:productId', checkAuthForCart, removeCartItem)

router.delete('/clear', clearCart)


export { router as cartRoute };