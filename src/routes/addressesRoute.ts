import express from 'express';
import { deleteUserAddress, getUserAddress, getUserAddresses, storeUserAddress, updateUserAddress } from '../controllers/addressesController.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { userAddressSchema } from '../validations/profileSchema.ts';
import { auth } from '../middlewares/authMiddleware.ts';

const router = express.Router();

router.route('/')
    .get(auth, getUserAddresses)
    .post(auth, validateInputData(userAddressSchema), storeUserAddress);

router.route('/:id')
    .get(auth, getUserAddress)
    .put(auth, validateInputData(userAddressSchema), updateUserAddress)
    .delete(auth, deleteUserAddress);

export { router as addressesRoute };