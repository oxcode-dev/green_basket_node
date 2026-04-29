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
import { createUserByAdmin, deleteUserByAdmin, getAdminUsers, getCustomerUsers, getUser, updateUserByAdmin } from '../controllers/usersController.ts';
import { productValidation } from '../validations/productValidation.ts';

const router = express.Router();

router.post('/login', validateInputData(loginSchema), userLogin);
router.delete('/logout', auth, userLogout);

// Category Routes
router.post('/categories', auth, handleAdmin, validateInputData(categoryValidation), createCategory);
router.route('/categories/:id')
    .put(auth, handleAdmin, validateInputData(categoryValidation), editCategory)
    .delete(auth, handleAdmin, deleteCategory);

// Product Routes
router.post('/products', auth, handleAdmin, validateInputData(productValidation), createProduct);
router.route('/products/:id')
    .put(auth, handleAdmin, validateInputData(productValidation), editProduct)
    .delete(auth, handleAdmin, deleteProduct);

// Order Routes
router.route('/orders')
    .get(auth, handleAdmin, getAllOrders as any)

router.route('/orders/:id')
    .get(auth, handleAdmin, getOrder as any)

router.get('/users', auth, handleAdmin, getAdminUsers as any)
router.post('/users', auth, handleAdmin, createUserByAdmin as any)
router.get('/users/customers', auth, handleAdmin, getCustomerUsers as any)

router.route('/users/:id')
    .get(auth, handleAdmin, getUser as any)
    .put(auth, handleAdmin, updateUserByAdmin as any)
    .delete(auth, handleAdmin, deleteUserByAdmin as any)

export { router as adminRoute };