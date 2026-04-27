import express from 'express';
import { addToCart, getCart } from '../controllers/cartController.ts';


const router = express.Router();

router.post('/add', addToCart);

router.get('/get', getCart);

export { router as cartRoute };