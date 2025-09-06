import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items: cartItems, total, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();

  const handleUpdateQuantity = (id: string, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + change);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout successful!",
      description: "Thank you for your sustainable purchase.",
    });
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Start shopping for sustainable treasures and help reduce waste!
          </p>
          <Button asChild className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
            <Link to="/">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Shopping Cart ({cartItems.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <Link to={`/product/${item.product.id}`}>
                    <img 
                      src={item.product.image} 
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-md hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  
                  <div className="flex-1 space-y-2">
                    <Link 
                      to={`/product/${item.product.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {item.product.title}
                    </Link>
                    <Badge variant="secondary">{item.product.category}</Badge>
                    <p className="text-sm text-muted-foreground">
                      Sold by {item.product.sellerName}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-display font-semibold text-primary">
                      ${item.product.price * item.quantity}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.title} x{item.quantity}</span>
                    <span>${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-display font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total}</span>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  Sustainable Impact
                </div>
                <p className="text-sm">
                  By purchasing these pre-loved items, you're preventing {cartItems.length} 
                  {cartItems.length === 1 ? ' item' : ' items'} from ending up in landfills!
                </p>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full gradient-primary text-primary-foreground border-0 hover:opacity-90"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;