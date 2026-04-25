import express from 'express';
import { auth } from '../middlewares/authMiddleware.ts';
import { validateInputData } from '../middlewares/validate.ts';
import { userLogin, userLogout } from '../controllers/authController.ts';
import { loginSchema } from '../validations/authValidation.ts';
import { handleAdmin } from '../middlewares/handleUserRole.ts';
import { createCategory, deleteCategory, editCategory } from '../controllers/categoriesController.ts';
import { createProduct, deleteProduct, editProduct } from '../controllers/productsController.ts';
import { categoryValidation } from '../validations/categoryValidation.ts';
import { getAllOrders, getOrder } from '../controllers/ordersController.ts';

const router = express.Router();

router.post('/login', validateInputData(loginSchema), userLogin);
router.delete('/logout', auth, userLogout);

// Category Routes
router.post('/categories', auth, handleAdmin, validateInputData(categoryValidation), createCategory);
router.route('/categories/:id')
    .put(auth, handleAdmin, validateInputData(categoryValidation), editCategory)
    .delete(auth, handleAdmin, deleteCategory);

// Product Routes
router.post('/products', auth, handleAdmin, createProduct);
router.route('/products/:id')
    .put(auth, handleAdmin, editProduct)
    .delete(auth, handleAdmin, deleteProduct);

// Order Routes
router.route('/orders')
    .get(auth, handleAdmin, getAllOrders as any)

router.route('/orders/:id')
    .get(auth, handleAdmin, getOrder as any)



export { router as adminRoute };