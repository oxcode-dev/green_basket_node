import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { userLogin, userLogout } from '../controllers/authController.ts';
import { loginSchema } from '../validations/authValidation.ts';
import { handleAdmin } from '../middlewares/handleUserRole.ts';
import { createCategory, deleteCategory, updateCategory } from '../controllers/categoriesController.ts';
import { createProduct, deleteProduct, updateProduct } from '../controllers/productsController.ts';

const router = express.Router();

router.post('/login', validateInputData(loginSchema), userLogin);
router.delete('/logout', auth, userLogout);

// Category Routes
router.post('/category', auth, handleAdmin, createCategory);
router.route('/category/:id')
    .put(auth, handleAdmin, updateCategory)
    .delete(auth, handleAdmin, deleteCategory);

// Product Routes
router.post('/category', auth, handleAdmin, createProduct);
router.route('/category/:id')
    .put(auth, handleAdmin, updateProduct)
    .delete(auth, handleAdmin, deleteProduct);



export { router as adminRoute };