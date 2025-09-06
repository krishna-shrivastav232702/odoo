import { Response } from 'express';
import { body } from 'express-validator';
import { prisma } from '../config/database.js';
import { AuthRequest, CreateProductRequest, SearchQuery } from '../types/index.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/imageUpload.js';

export const createProductValidation = [
  body('title').isLength({ min: 3 }).trim(),
  body('price').isFloat({ min: 0 }),
  body('categoryId').isInt({ min: 1 }),
  body('condition').isIn(['new', 'like_new', 'good', 'fair', 'poor'])
];

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, categoryId, condition, imageUrls = [] }: CreateProductRequest = req.body;

    const product = await prisma.product.create({
      data: {
        title,
        description: description || null,
        price: parseFloat(price.toString()),
        categoryId,
        condition,
        imageUrls,
        sellerId: req.user!.id
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      q, 
      category, 
      minPrice, 
      maxPrice, 
      condition, 
      page = 1, 
      limit = 20, 
      sortBy = 'date', 
      sortOrder = 'desc' 
    }: SearchQuery = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    let where: any = {
      status: 'available'
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (category) {
      // Handle both category name and category ID
      if (isNaN(parseInt(category))) {
        // It's a category name, find the category by name
        const categoryRecord = await prisma.category.findFirst({
          where: { name: { equals: category, mode: 'insensitive' } }
        });
        if (categoryRecord) {
          where.categoryId = categoryRecord.id;
        } else {
          // If category name not found, return empty results
          where.categoryId = -1;
        }
      } else {
        // It's a category ID
        where.categoryId = parseInt(category);
      }
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice.toString());
      if (maxPrice) where.price.lte = parseFloat(maxPrice.toString());
    }

    if (condition) {
      where.condition = condition;
    }

    let orderBy: any = {};
    switch (sortBy) {
      case 'price':
        orderBy.price = sortOrder;
        break;
      case 'date':
      default:
        orderBy.createdAt = sortOrder;
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              username: true,
              fullName: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy,
        skip,
        take
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: take,
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id!) },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            fullName: true,
            phone: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, categoryId, condition, imageUrls } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id!) }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (existingProduct.sellerId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id!) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price.toString()) }),
        ...(categoryId && { categoryId }),
        ...(condition && { condition }),
        ...(imageUrls && { imageUrls })
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id!) }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (existingProduct.sellerId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await prisma.product.delete({
      where: { id: parseInt(id!) }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const products = await prisma.product.findMany({
      where: { sellerId: req.user!.id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    res.json({ products });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadProductImages = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const imageUrls = await Promise.all(uploadPromises);

    res.json({
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};

export const deleteProductImage = async (req: AuthRequest, res: Response) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Extract public ID from Cloudinary URL
    const publicId = extractPublicId(imageUrl);
    await deleteFromCloudinary(publicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
