import express from 'express';
import { validateInputData } from '../middlewares/validate.ts';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController.ts';
import { forgotPasswordSchema, resetPasswordSchema } from '../validations/authValidation.ts';

const router = express.Router();

router.post('/forgot', validateInputData(forgotPasswordSchema), forgotPassword);
router.post('/generate-otp', validateInputData(forgotPasswordSchema), forgotPassword);
router.post('/reset', validateInputData(resetPasswordSchema), resetPassword);

export { router as passwordResetRoute };