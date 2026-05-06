import express from 'express';

import { auth } from '../middlewares/authMiddleware.ts';
import { deleteWishlist, getUserWishlist, getUserWishlists, createWishlist } from '../controllers/wishlistsController.ts';
import { handleCustomer } from '../middlewares/handleUserRole.ts';

const router = express.Router();

router.get('/', auth as any, getUserWishlists as any)
router.post('/:product_id', auth as any, handleCustomer, createWishlist as any)
router.get('/:id', auth as any, getUserWishlist)
router.delete('/:id', auth as any, handleCustomer, deleteWishlist)

export { router as wishlistsRoute };