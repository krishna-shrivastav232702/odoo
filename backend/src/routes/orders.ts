import { Router } from 'express';
import {
  checkout,
  getOrders,
  getOrder,
  getSales,
  checkoutValidation
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

router.post('/checkout', authenticate, checkoutValidation, validateRequest, checkout);
router.get('/', authenticate, getOrders);
router.get('/sales', authenticate, getSales);
router.get('/:id', authenticate, getOrder);

export default router;