import express from 'express';
import { getProduct, getProducts, getProductsByCategory } from '../controllers/productsController.ts';
import { handlePagination } from '../middlewares/handlePagination.ts';

const router = express.Router();


router.get('/', handlePagination as any, getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

export { router as ProductsRoute };


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

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category with pagination
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: List of products and pagination metadata queried by category
 */