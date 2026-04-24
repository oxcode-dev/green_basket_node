import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { userLogin, userLogout } from '../controllers/authController.ts';
import { loginSchema } from '../validations/authValidation.ts';
import { handleAdmin } from '../middlewares/handleUserRole.ts';
import { createCategory, deleteCategory, updateCategory } from '../controllers/categoriesController.ts';

const router = express.Router();

router.post('/login', validateInputData(loginSchema), userLogin);
router.delete('/logout', auth, userLogout);

router.post('/category', auth, handleAdmin, createCategory);

router.route('/category/:id')
    .put(auth, handleAdmin, updateCategory)
    .delete(auth, handleAdmin, deleteCategory);



export { router as adminRoute };