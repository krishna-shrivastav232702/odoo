import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { cartAPI } from '@/lib/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { useToast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
}

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotals = (items: CartItem[]) => {
  // Ensure items is an array before using reduce
  if (!Array.isArray(items)) {
    return { total: 0, itemCount: 0 };
  }
  
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();

  const { total, itemCount } = calculateTotals(items);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  // Real-time cart updates
  useEffect(() => {
    if (socket && isAuthenticated) {
      // Listen for real-time cart updates
      socket.on('cart_updated', () => {
        refreshCart();
      });

      return () => {
        socket.off('cart_updated');
      };
    }
  }, [socket, isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await cartAPI.getCart();
      // Fix: Extract cartItems from the response properly
      const cartItems = response.data.cartItems || response.data || [];
      setItems(Array.isArray(cartItems) ? cartItems : []);
    } catch (error: any) {
      console.error('Error loading cart:', error);
      // Set empty array on error
      setItems([]);
      if (error.response?.status !== 401) {
        toast({
          title: 'Error',
          description: 'Failed to load cart',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to add items to cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      await cartAPI.addToCart(product.id, quantity);
      await refreshCart(); // Refresh immediately for better UX
      toast({
        title: 'Added to cart',
        description: `${product.title} has been added to your cart`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      await refreshCart();
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to remove item from cart',
        variant: 'destructive',
      });
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await cartAPI.updateCartItem(cartItemId, quantity);
      await refreshCart();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update cart item',
        variant: 'destructive',
      });
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setItems([]);
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to clear cart',
        variant: 'destructive',
      });
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      total,
      itemCount,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};