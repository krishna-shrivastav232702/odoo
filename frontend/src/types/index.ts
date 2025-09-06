export interface User {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  sellerId: number;
  title: string;
  description?: string;
  price: number;
  categoryId: number;
  condition: string;
  status: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt?: string;
  seller: User;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  product: Product;
}

export interface Order {
  id: number;
  buyerId: number;
  totalAmount: number;
  shippingAddress?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  buyer: User;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  sellerId: number;
  title: string;
  price: number;
  quantity: number;
  product: Product;
  seller: User;
}

export interface Conversation {
  id: number;
  buyerId: number;
  sellerId: number;
  productId?: number;
  createdAt: string;
  updatedAt: string;
  buyer: User;
  seller: User;
  product?: Product;
  messages: Message[];
  unreadCount?: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  sender: User;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  q?: string; // Fixed: backend expects 'q' not 'search'
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  page?: number;
  limit?: number;
}

export interface SocketEvents {
  // Client to Server
  join_conversation: (conversationId: number) => void;
  leave_conversation: (conversationId: number) => void;
  send_message: (data: { conversationId: number; content: string; messageType?: string }) => void;
  mark_messages_read: (conversationId: number) => void;
  typing_start: (conversationId: number) => void;
  typing_stop: (conversationId: number) => void;

  // Server to Client
  new_message: (message: Message) => void;
  new_message_notification: (data: { message: Message; conversation: Conversation }) => void;
  messages_read: (data: { conversationId: number; userId: number }) => void;
  user_typing: (data: { conversationId: number; userId: number; username: string }) => void;
  user_stopped_typing: (data: { conversationId: number; userId: number }) => void;
}

// Categories constant for forms and filters
export const CATEGORIES = [
  'Electronics',
  'Clothing', 
  'Books',
  'Home & Garden',
  'Sports',
  'Toys & Games'
] as const;