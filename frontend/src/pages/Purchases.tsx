import { useState, useEffect } from 'react';
import { Calendar, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types';
import { Link } from 'react-router-dom';
import { ordersAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Purchases = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersAPI.getOrders();
      setOrders(response.data.orders || response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold mb-2">No purchases yet</h1>
          <p className="text-muted-foreground mb-6">
            Start shopping for sustainable treasures!
          </p>
          <Link to="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Purchase History
        </h1>
        <p className="text-muted-foreground">
          Your contribution to the circular economy
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-primary">
                    ${order.totalAmount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <img 
                      src={item.product.imageUrls?.[0] || '/placeholder.svg'} 
                      alt={item.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <Link 
                        to={`/product/${item.productId}`}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-muted-foreground">
                          Sold by {item.seller.username}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-semibold">
                            ${item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {order.shippingAddress && (
                <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm font-medium">Shipping Address:</span>
                  <p className="text-sm text-muted-foreground mt-1">{order.shippingAddress}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Purchases;