export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Purchase {
  id: string;
  product: Product;
  purchaseDate: string;
  price: number;
}

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports',
  'Toys & Games',
  'Beauty & Health',
  'Automotive',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];