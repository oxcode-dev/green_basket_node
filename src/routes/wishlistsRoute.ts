import express from 'express';

import { auth } from '../middlewares/authMiddleware.ts';
import { deleteWishlist, getUserWishlist, getUserWishlists, storeWishlist } from '../controllers/wishlistsController.ts';

const router = express.Router();

router.get('/', auth, getUserWishlists)
router.post('/', auth, storeWishlist)
router.get('/:id', auth, getUserWishlist)
router.delete('/:id', auth, deleteWishlist)

export { router as wishlistsRoute };