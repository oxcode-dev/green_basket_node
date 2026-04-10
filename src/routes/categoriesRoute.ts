import express from 'express';
import { getCategories, getCategory } from '../controllers/categoriesController.ts';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

export { router as categoriesRoute };