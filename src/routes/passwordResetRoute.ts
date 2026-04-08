import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/PasswordResetController.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { forgotPasswordSchema, resetPasswordSchema } from '../schemas/authSchema.ts';

const router = express.Router();

router.post('/forgot', validateInputData(forgotPasswordSchema), forgotPassword);
router.post('/reset', validateInputData(resetPasswordSchema), resetPassword);

export { router as passwordResetRoute };