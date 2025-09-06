import { Router } from 'express';
import {
  startConversation,
  getConversations,
  getConversation,
  sendMessage,
  markAsRead,
  getUnreadCount,
  startConversationValidation,
  sendMessageValidation
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

router.post('/conversations', authenticate, startConversationValidation, validateRequest, startConversation);
router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:id', authenticate, getConversation);
router.put('/conversations/:id/read', authenticate, markAsRead);
router.post('/messages', authenticate, sendMessageValidation, validateRequest, sendMessage);
router.get('/unread-count', authenticate, getUnreadCount);

export default router;
