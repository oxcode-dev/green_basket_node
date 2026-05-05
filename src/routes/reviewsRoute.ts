import express from 'express';

import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { productReviewSchema } from '../validations/profileValidation.ts';
import { getReviews, getReview, deleteReview, createReview } from '../controllers/reviewsController.ts';
import { handleCustomer } from '../middlewares/handleUserRole.ts';

const router = express.Router();

router.get('/', auth, getReviews as any)
router.post('/', auth, handleCustomer, validateInputData(productReviewSchema), createReview as any)
router.get('/:id', auth, getReview as any)
router.delete('/:id', auth, handleCustomer, deleteReview as any)

export { router as reviewsRoute };