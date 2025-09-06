import { Response } from 'express';
import { body } from 'express-validator';
import { prisma } from '../config/database.js';
import { AuthRequest } from '../types/index.js';

export const startConversationValidation = [
  body('sellerId').isInt().withMessage('Seller ID is required'),
  body('productId').optional().isInt().withMessage('Product ID must be a number')
];

export const sendMessageValidation = [
  body('conversationId').isInt().withMessage('Conversation ID is required'),
  body('content').isString().notEmpty().withMessage('Message content is required'),
  body('messageType').optional().isString().withMessage('Message type must be a string')
];

export const startConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { sellerId, productId } = req.body;
    const buyerId = req.user!.id;

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        buyerId,
        sellerId: parseInt(sellerId),
        productId: productId ? parseInt(productId) : null
      },
      include: {
        buyer: { select: { id: true, username: true } },
        seller: { select: { id: true, username: true } },
        product: { select: { id: true, title: true } }
      }
    });

    if (!conversation) {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          buyerId,
          sellerId: parseInt(sellerId),
          productId: productId ? parseInt(productId) : null
        },
        include: {
          buyer: { select: { id: true, username: true } },
          seller: { select: { id: true, username: true } },
          product: { select: { id: true, title: true } }
        }
      });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        buyer: { select: { id: true, username: true } },
        seller: { select: { id: true, username: true } },
        product: { select: { id: true, title: true, imageUrls: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            messageType: true,
            createdAt: true,
            sender: { select: { id: true, username: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: Number(limit)
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id!) },
      include: {
        buyer: { select: { id: true, username: true } },
        seller: { select: { id: true, username: true } },
        product: { select: { id: true, title: true, imageUrls: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, username: true } }
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, content, messageType = 'text' } = req.body;
    const senderId = req.user!.id;

    // Verify conversation exists and user is part of it
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(conversationId) }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.buyerId !== senderId && conversation.sellerId !== senderId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: parseInt(conversationId),
        senderId,
        content,
        messageType
      },
      include: {
        sender: { select: { id: true, username: true } }
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: parseInt(conversationId) },
      data: { updatedAt: new Date() }
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};