import { Response } from 'express';
import { body } from 'express-validator';
import { prisma } from '../config/database.js';
import { AuthRequest } from '../types/index.js';

export const addToCartValidation = [
  body('productId').isInt({ min: 1 }),
  body('quantity').optional().isInt({ min: 1 })
];

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.status !== 'available') {
      return res.status(400).json({ error: 'Product is not available' });
    }

    if (product.sellerId === req.user!.id) {
      return res.status(400).json({ error: 'Cannot add your own product to cart' });
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user!.id,
          productId
        }
      }
    });

    let cartItem;

    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          product: {
            include: {
              seller: {
                select: {
                  id: true,
                  username: true
                }
              },
              category: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user!.id,
          productId,
          quantity
        },
        include: {
          product: {
            include: {
              seller: {
                select: {
                  id: true,
                  username: true
                }
              },
              category: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
    }

    res.status(201).json({
      message: 'Item added to cart',
      cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                username: true
              }
            },
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

    res.json({
      cartItems,
      totalAmount,
      itemCount: cartItems.length
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(id!) }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(id!) },
      data: { quantity },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                username: true
              }
            },
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Cart item updated',
      cartItem: updatedItem
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(id!) }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.cartItem.delete({
      where: { id: parseInt(id!) }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user!.id }
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
