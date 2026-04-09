import express from 'express';
import { getCategories } from '../controllers/categoriesController.ts';

const router = express.Router();

router.get('/', getCategories);

export { router as categoriesRoute };