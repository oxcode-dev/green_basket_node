import express from 'express';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.ts';


const router = express.Router();

router.post('/add', addToCart);

router.get('/get', getCart);

router.put('/update/:productId', updateCartItem);

router.delete('/remove/:productId', removeCartItem)

router.delete('/clear', clearCart)


export { router as cartRoute };