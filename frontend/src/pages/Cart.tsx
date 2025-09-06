import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckoutModal } from '@/components/CheckoutModal';

const Cart = () => {
  const { items: cartItems, total, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleUpdateQuantity = (cartItemId: number, change: number) => {
    const item = cartItems.find(item => item.id === cartItemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(cartItemId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (cartItemId: number) => {
    removeItem(cartItemId);
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Discover amazing pre-loved items and start your sustainable shopping journey!
          </p>
          <Button asChild className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
            <Link to="/">
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Shopping Cart
        </h1>
        <p className="text-muted-foreground">
          Review your sustainable finds before checkout
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="shadow-medium">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img 
                    src={item.product.imageUrls[0] || '/placeholder.svg'} 
                    alt={item.product.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <Link 
                      to={`/product/${item.product.id}`}
                      className="text-lg font-semibold hover:text-primary transition-colors"
                    >
                      {item.product.title}
                    </Link>
                    <Badge variant="outline" className="mt-1">
                      {item.product.category.name}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Sold by {item.product.seller.username}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-display font-bold text-primary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-medium sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.title} x{item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full gradient-primary text-primary-foreground border-0 hover:opacity-90"
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>

              <div className="text-xs text-muted-foreground pt-4">
                🌱 By shopping with EcoFinds, you're supporting the circular economy and reducing environmental impact.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutModalOpen} 
        onClose={handleCloseCheckoutModal} 
      />
    </div>
  );
};

export default Cart;