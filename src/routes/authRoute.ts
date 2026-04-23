import express from 'express';

import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { userLogin, userLogout, userRegistration } from '../controllers/authController.ts';
import { loginSchema, registerSchema } from '../validations/authValidation.ts';

const router = express.Router();

router.post('/register', validateInputData(registerSchema), userRegistration);
router.post('/login', validateInputData(loginSchema), userLogin);
router.delete('/logout', auth, userLogout);

export { router as authRoute };