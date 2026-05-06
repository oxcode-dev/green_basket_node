import express from 'express';
import { getCategories, getCategory } from '../controllers/categoriesController.ts';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category List and Details
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories with pagination
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories and pagination metadata
 */
router.get('/', getCategories);
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: category details
 *       404:
 *         description: Category not found
 */
router.get('/:id', getCategory);

export { router as categoriesRoute };