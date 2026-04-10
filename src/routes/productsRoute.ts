import express from 'express';
import { getProduct, getProducts } from '../controllers/productsController.ts';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

export { router as ProductsRoute };