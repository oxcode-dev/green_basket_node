import express from 'express';
import {z} from "zod"

import { 
    userLogin, 
    userLogout, 
    userRegistration 
} from '../controllers/AuthController.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { loginSchema, registerSchema } from '../schemas/authSchema.ts';

const router = express.Router();

router.post('/register', validateInputData(registerSchema), userRegistration);
router.post('/login', validateInputData(loginSchema), userLogin);
router.delete('/logout', auth, userLogout);

export { router as authRouter };