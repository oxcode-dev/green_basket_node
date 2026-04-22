import express from 'express';
import { deleteUserAddress, getUserAddress, getUserAddresses, storeUserAddress, updateUserAddress } from '../controllers/addressesController.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { userAddressSchema } from '../validations/profileValidation.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { handleCustomer } from '../middlewares/handleUserRole.ts';

const router = express.Router();

router.route('/')
    .get(auth, handleCustomer, getUserAddresses)
    .post(auth, handleCustomer, validateInputData(userAddressSchema), storeUserAddress);

router.route('/:id')
    .get(auth, getUserAddress)
    .put(auth, validateInputData(userAddressSchema), updateUserAddress)
    .delete(auth, deleteUserAddress);

export { router as addressesRoute };