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

router.get('/', auth as any, getUserDetails as any);

router.put('/', auth as any, validateInputData(userDetailsSchema), updateUserDetails as any);
    
router.post('/upload-avatar', auth as any, localUpload, uploadAvatar as any);

router.post('/change-password', auth as any, validateInputData(changePasswordSchema), changePassword as any);
router.delete('/delete-account', auth as any, deleteProfile as any);

export { router as profileRoute };

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User Profiles and Details
 */


/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user details
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user details
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *           
 *             example:
 *               first_name: "Jane"
 *               last_name: "Doe"
 *               email: "jane@example.com"
 *               phone: "+1234567890"
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/profile/upload-avatar:
 *   post:
 *     summary: Upload or update user avatar
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Upload error
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/profile/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             example:
 *               currentPassword: "oldpass123"
 *               newPassword: "newpass456"
 *               confirmPassword: "newpass456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/profile/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */