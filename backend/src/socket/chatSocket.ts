import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/auth.js';
import { prisma } from '../config/database.js';
import { SocketUser } from '../types/index.js';

interface AuthSocket extends Socket {
  user?: SocketUser;
}

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000', 'http://localhost:5173'],
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true
        }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User ${socket.user?.username} connected to chat`);

    socket.join(`user_${socket.user?.id}`);

    socket.on('join_conversation', async (conversationId: number) => {
      try {
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId }
        });

        if (conversation && (conversation.buyerId === socket.user?.id || conversation.sellerId === socket.user?.id)) {
          socket.join(`conversation_${conversationId}`);
          console.log(`User ${socket.user?.username} joined conversation ${conversationId}`);
        }
      } catch (error) {
        console.error('Error joining conversation:', error);
      }
    });

    socket.on('send_message', async (data: {
      conversationId: number;
      content: string;
      messageType?: string;
    }) => {
      try {
        const { conversationId, content, messageType = 'text' } = data;

        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: {
            buyer: { select: { id: true, username: true } },
            seller: { select: { id: true, username: true } },
            product: { select: { id: true, title: true } }
          }
        });

        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        if (conversation.buyerId !== socket.user?.id && conversation.sellerId !== socket.user?.id) {
          socket.emit('error', { message: 'Not authorized to send message in this conversation' });
          return;
        }

        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: socket.user!.id,
            content,
            messageType
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true
              }
            }
          }
        });

        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });

        io.to(`conversation_${conversationId}`).emit('new_message', {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          content: message.content,
          messageType: message.messageType,
          isRead: message.isRead,
          createdAt: message.createdAt,
          sender: message.sender
        });

        const recipientId = conversation.buyerId === socket.user?.id ? conversation.sellerId : conversation.buyerId;
        
        await prisma.notification.create({
          data: {
            userId: recipientId,
            title: 'New Message',
            message: `${socket.user?.username} sent you a message${conversation.product ? ` about "${conversation.product.title}"` : ''}`,
            type: 'message'
          }
        });

        io.to(`user_${recipientId}`).emit('new_notification', {
          title: 'New Message',
          message: `${socket.user?.username} sent you a message${conversation.product ? ` about "${conversation.product.title}"` : ''}`,
          type: 'message',
          conversationId: conversationId
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing_start', (conversationId: number) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: socket.user?.id,
        username: socket.user?.username
      });
    });

    socket.on('typing_stop', (conversationId: number) => {
      socket.to(`conversation_${conversationId}`).emit('user_stop_typing', {
        userId: socket.user?.id
      });
    });

    socket.on('mark_messages_read', async (conversationId: number) => {
      try {
        await prisma.message.updateMany({
          where: {
            conversationId,
            senderId: { not: socket.user!.id },
            isRead: false
          },
          data: { isRead: true }
        });

        socket.to(`conversation_${conversationId}`).emit('messages_read', {
          conversationId,
          readById: socket.user?.id
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.username} disconnected from chat`);
    });
  });

  return io;
};