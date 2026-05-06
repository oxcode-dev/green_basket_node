import express from 'express';
import { deleteUserAddress, getUserAddress, getUserAddresses, storeUserAddress, updateUserAddress } from '../controllers/addressesController.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { userAddressSchema } from '../validations/profileValidation.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { handleCustomer } from '../middlewares/handleUserRole.ts';

const router = express.Router();

router.route('/')
    .get(auth as any, handleCustomer, getUserAddresses as any)
    .post(auth as any, handleCustomer, validateInputData(userAddressSchema), storeUserAddress as any);

router.route('/:id')
    .get(auth as any, handleCustomer, getUserAddress as any)
    .put(auth as any, handleCustomer, validateInputData(userAddressSchema), updateUserAddress as any)
    .delete(auth as any, handleCustomer, deleteUserAddress as any);

export { router as addressesRoute };