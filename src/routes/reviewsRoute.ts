import express from 'express';

import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { productReviewSchema } from '../validations/profileValidation.ts';
import { getReviews, getReview, deleteReview, storeReview } from '../controllers/reviewsController.ts';

const router = express.Router();

router.get('/', auth, getReviews)
router.post('/', auth, validateInputData(productReviewSchema), storeReview)
router.get('/:id', auth, getReview)
router.delete('/:id', auth, deleteReview)

export { router as reviewsRoute };