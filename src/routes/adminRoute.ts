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
import { userDetailsValidation } from '../validations/userValidation.ts';

const router = express.Router();

router.post('/login', validateInputData(loginSchema), userLogin);
router.delete('/logout', auth as any, userLogout);

// Category Routes
router.post('/categories', auth as any, handleAdmin, validateInputData(categoryValidation), createCategory as any);
router.route('/categories/:id')
    .put(auth as any, handleAdmin, validateInputData(categoryValidation), editCategory as any)
    .delete(auth as any, handleAdmin, deleteCategory as any);

// Product Routes
router.post('/products', auth as any, handleAdmin, validateInputData(productValidation), createProduct as any);
router.route('/products/:id')
    .put(auth as any, handleAdmin, validateInputData(productValidation), editProduct as any)
    .delete(auth as any, handleAdmin, deleteProduct as any);

// Order Routes
router.route('/orders')
    .get(auth as any, handleAdmin, getAllOrders as any)

router.route('/orders/:id')
    .get(auth as any, handleAdmin, getOrder as any)

router.get('/users', auth as any, handleAdmin, getAdminUsers as any)
router.post('/users', auth as any, handleAdmin, validateInputData(userDetailsValidation), createUserByAdmin as any)
router.get('/users/customers', auth as any, handleAdmin, getCustomerUsers as any)

router.route('/users/:id')
    .get(auth as any, handleAdmin, getUser as any)
    .put(auth as any, handleAdmin, validateInputData(userDetailsValidation), updateUserByAdmin as any)
    .delete(auth as any, handleAdmin, deleteUserByAdmin as any)

export { router as adminRoute };