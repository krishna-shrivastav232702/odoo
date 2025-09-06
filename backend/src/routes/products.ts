import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getUserProducts,
  createProductValidation
} from '../controllers/productController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

router.post('/', authenticate, createProductValidation, validateRequest, createProduct);
router.get('/', optionalAuth, getProducts);
router.get('/my-products', authenticate, getUserProducts);
router.get('/:id', optionalAuth, getProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
