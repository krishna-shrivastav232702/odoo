import { Product, User, CartItem, Purchase } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'john@example.com',
  username: 'john_eco',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: '2024-01-15T00:00:00Z'
};

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Classic brown leather jacket in excellent condition. Perfect for the environmentally conscious fashion lover.',
    category: 'Clothing',
    price: 85,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    sellerId: '2',
    sellerName: 'sarah_vintage',
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    title: 'iPhone 12 Pro',
    description: 'Used iPhone 12 Pro in great condition. Minor scratches on the back, screen is perfect.',
    category: 'Electronics',
    price: 450,
    image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&h=400&fit=crop',
    sellerId: '3',
    sellerName: 'tech_saver',
    createdAt: '2024-01-19T00:00:00Z'
  },
  {
    id: '3',
    title: 'Wooden Coffee Table',
    description: 'Handcrafted wooden coffee table. Some signs of use but still very sturdy and beautiful.',
    category: 'Home & Garden',
    price: 120,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    sellerId: '4',
    sellerName: 'furniture_finder',
    createdAt: '2024-01-18T00:00:00Z'
  },
  {
    id: '4',
    title: 'Running Shoes',
    description: 'Nike running shoes, lightly used. Perfect for someone starting their fitness journey sustainably.',
    category: 'Sports',
    price: 35,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    sellerId: '5',
    sellerName: 'fitness_guru',
    createdAt: '2024-01-17T00:00:00Z'
  },
  {
    id: '5',
    title: 'Guitar - Acoustic',
    description: 'Beautiful acoustic guitar in excellent condition. Comes with a case and pick.',
    category: 'Other',
    price: 200,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop',
    sellerId: '6',
    sellerName: 'music_lover',
    createdAt: '2024-01-16T00:00:00Z'
  },
  {
    id: '6',
    title: 'Plant Collection',
    description: 'Beautiful set of 5 houseplants. Perfect for creating a green, sustainable living space.',
    category: 'Home & Garden',
    price: 45,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    sellerId: '7',
    sellerName: 'plant_parent',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

export const mockCartItems: CartItem[] = [
  {
    id: 'cart1',
    product: mockProducts[0],
    quantity: 1
  },
  {
    id: 'cart2', 
    product: mockProducts[2],
    quantity: 1
  }
];

export const mockPurchases: Purchase[] = [
  {
    id: 'purchase1',
    product: mockProducts[3],
    purchaseDate: '2024-01-10T00:00:00Z',
    price: 35
  },
  {
    id: 'purchase2',
    product: mockProducts[4],
    purchaseDate: '2024-01-05T00:00:00Z',
    price: 200
  }
];