import { Router } from 'express';
import {
  startConversation,
  getConversations,
  getConversation,
  sendMessage,
  startConversationValidation,
  sendMessageValidation
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

router.post('/conversations', authenticate, startConversationValidation, validateRequest, startConversation);
router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:id', authenticate, getConversation);
router.post('/messages', authenticate, sendMessageValidation, validateRequest, sendMessage);

export default router;
