import express from 'express';
import { getProduct, getProducts, getProductsByCategory } from '../controllers/productsController.ts';
import { handlePagination } from '../middlewares/handlePagination.ts';

const router = express.Router();

router.get('/', handlePagination, getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

export { router as ProductsRoute };