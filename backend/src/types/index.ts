import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
    address?: string;
  };
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  categoryId: number;
  condition: string;
  imageUrls?: string[];
}

export interface SearchQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'date' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface SocketUser {
  id: number;
  username: string;
  email: string;
}
