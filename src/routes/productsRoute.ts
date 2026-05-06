import express from 'express';
import { getProduct, getProducts, getProductsByCategory } from '../controllers/productsController.ts';
import { handlePagination } from '../middlewares/handlePagination.ts';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product List and Details
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products and pagination metadata
 */
router.get('/', handlePagination as any, getProducts);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category with pagination
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products and pagination metadata queried by category
 */
router.get('/category/:category', getProductsByCategory);


router.get('/:id', getProduct);

export { router as ProductsRoute };