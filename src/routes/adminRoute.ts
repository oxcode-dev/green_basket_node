import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { userLogin, userLogout } from '../controllers/authController.ts';
import { loginSchema } from '../validations/authValidation.ts';
import { handleAdmin } from '../middlewares/handleUserRole.ts';
import { createCategory, deleteCategory, editCategory } from '../controllers/categoriesController.ts';
import { createProduct, deleteProduct, updateProduct } from '../controllers/productsController.ts';
import { categoryValidation } from '../validations/categoryValidation.ts';

const router = express.Router();

router.post('/login', validateInputData(loginSchema), userLogin);
router.delete('/logout', auth, userLogout);

// Category Routes
// router.post('/categories', auth, handleAdmin, createCategory);
router.post('/categories', auth, handleAdmin, validateInputData(categoryValidation), createCategory);
router.route('/categories/:id')
    .put(auth, handleAdmin, validateInputData(categoryValidation), editCategory)
    .delete(auth, handleAdmin, deleteCategory);

// Product Routes
router.post('/products', auth, handleAdmin, createProduct);
router.route('/products/:id')
    .put(auth, handleAdmin, updateProduct)
    .delete(auth, handleAdmin, deleteProduct);



export { router as adminRoute };