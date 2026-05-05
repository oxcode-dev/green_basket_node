import express from 'express';

import { auth } from '../middlewares/authMiddleware.ts';
import { deleteWishlist, getUserWishlist, getUserWishlists, createWishlist } from '../controllers/wishlistsController.ts';
import { handleCustomer } from '../middlewares/handleUserRole.ts';

const router = express.Router();

router.get('/', auth, getUserWishlists as any)
router.post('/:product_id', auth, handleCustomer, createWishlist as any)
router.get('/:id', auth, getUserWishlist)
router.delete('/:id', auth, handleCustomer, deleteWishlist)

export { router as wishlistsRoute };