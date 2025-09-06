import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  registerValidation,
  loginValidation
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);

export default router;
