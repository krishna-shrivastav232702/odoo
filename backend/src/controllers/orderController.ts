import { Response } from 'express';
import { body } from 'express-validator';
import { prisma } from '../config/database.js';
import { AuthRequest } from '../types/index.js';

export const checkoutValidation = [
  body('shippingAddress').optional().isString()
];

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    const { shippingAddress } = req.body;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, username: true }
            }
          }
        }
      }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const unavailableItems = cartItems.filter((item: any) => item.product.status !== 'available');
    if (unavailableItems.length > 0) {
      return res.status(400).json({ 
        error: 'Some items are no longer available',
        unavailableItems: unavailableItems.map((item: any) => ({
          productId: item.product.id,
          title: item.product.title
        }))
      });
    }

    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

    const order = await prisma.order.create({
      data: {
        buyerId: req.user!.id,
        totalAmount,
        shippingAddress: shippingAddress || req.user!.address || ''
      }
    });

    const orderItems = await Promise.all(
      cartItems.map(async (cartItem: any) => {
        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: cartItem.product.id,
            sellerId: cartItem.product.sellerId,
            title: cartItem.product.title,
            price: cartItem.product.price,
            quantity: cartItem.quantity
          }
        });

        await prisma.product.update({
          where: { id: cartItem.product.id },
          data: { status: 'sold' }
        });

        await prisma.notification.create({
          data: {
            userId: cartItem.product.sellerId,
            title: 'New Order Received',
            message: `Your product "${cartItem.product.title}" has been ordered by ${req.user!.username}`,
            type: 'order'
          }
        });

        return orderItem;
      })
    );

    await prisma.cartItem.deleteMany({
      where: { userId: req.user!.id }
    });

    await prisma.notification.create({
      data: {
        userId: req.user!.id,
        title: 'Order Placed Successfully',
        message: `Your order #${order.id} has been placed successfully`,
        type: 'order'
      }
    });

    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                imageUrls: true
              }
            },
            seller: {
              select: {
                id: true,
                username: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order: completeOrder
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const orders = await prisma.order.findMany({
      where: { buyerId: req.user!.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                imageUrls: true
              }
            },
            seller: {
              select: {
                id: true,
                username: true,
                fullName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id!) },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                imageUrls: true,
                description: true
              }
            },
            seller: {
              select: {
                id: true,
                username: true,
                fullName: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.buyerId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSales = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const sales = await prisma.orderItem.findMany({
      where: { sellerId: req.user!.id },
      include: {
        order: {
          include: {
            buyer: {
              select: {
                id: true,
                username: true,
                fullName: true
              }
            }
          }
        },
        product: {
          select: {
            id: true,
            title: true,
            imageUrls: true
          }
        }
      },
      orderBy: { order: { createdAt: 'desc' } },
      skip,
      take: Number(limit)
    });

    res.json({ sales });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};