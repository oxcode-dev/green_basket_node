import express from 'express';

import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { changePasswordSchema, userDetailsSchema } from '../validations/profileSchema.ts';
import { getUserOrder, getUserOrders } from '../controllers/ordersController.ts';

const router = express.Router();

router.route('/')
    .get(auth, getUserOrders as any)

router.route('/:id')
    .get(auth, getUserOrder as any)

export { router as ordersRouter };