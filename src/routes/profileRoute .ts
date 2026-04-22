import express from 'express';
import { 
    getUserDetails, changePassword, updateUserDetails, deleteProfile,
    uploadAvatar
} from '../controllers/profileController.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { changePasswordSchema, userDetailsSchema } from '../validations/profileValidation.ts';
import { localUpload } from '../middlewares/handleUpload.ts';

const router = express.Router();

router.route('/')
    .get(auth, getUserDetails as any)
    .put(auth, validateInputData(userDetailsSchema), updateUserDetails as any);
    
router.post('/upload-avatar', auth, localUpload, uploadAvatar as any);
// router.post('/upload-avatar', auth, validateInputData(imageSchema), localUpload, uploadAvatar as any);
router.post('/change-password', auth, validateInputData(changePasswordSchema), changePassword as any);
router.delete('/delete-account', auth, deleteProfile as any);

export { router as profileRouter };
