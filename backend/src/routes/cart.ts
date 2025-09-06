import { Router } from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  addToCartValidation
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

router.post('/add', authenticate, addToCartValidation, validateRequest, addToCart);
router.get('/', authenticate, getCart);
router.put('/:id', authenticate, updateCartItem);
router.delete('/:id', authenticate, removeFromCart);
router.delete('/', authenticate, clearCart);

export default router;
