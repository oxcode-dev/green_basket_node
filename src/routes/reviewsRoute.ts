import express from 'express';

import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { productReviewSchema } from '../validations/profileValidation.ts';
import { getReviews, getReview, deleteReview, createReview } from '../controllers/reviewsController.ts';
import { handleCustomer } from '../middlewares/handleUserRole.ts';

const router = express.Router();

router.get('/', auth as any, getReviews as any)
router.post('/', auth as any, handleCustomer, validateInputData(productReviewSchema), createReview as any)
router.get('/:id', auth as any, getReview as any)
router.delete('/:id', auth as any, handleCustomer, deleteReview as any)

export { router as reviewsRoute };