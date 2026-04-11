import express from 'express';
import { getProduct, getProducts, getProductsByCategory } from '../controllers/productsController.ts';

const router = express.Router();

router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

export { router as ProductsRoute };