import express from 'express';

import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { changePasswordSchema, userDetailsSchema } from '../validations/profileValidation.ts';
import { getUserOrder, getUserOrders } from '../controllers/ordersController.ts';
import { handleCustomer } from '../middlewares/handleUserRole.ts';

const router = express.Router();

router.route('/')
    .get(auth, handleCustomer, getUserOrders)

router.route('/:id')
    .get(auth, handleCustomer, getUserOrder)

export { router as ordersRoute };