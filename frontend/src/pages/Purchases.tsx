import { Calendar, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockPurchases } from '@/data/mockData';
import { Link } from 'react-router-dom';

const Purchases = () => {
  if (mockPurchases.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold mb-2">No purchases yet</h1>
          <p className="text-muted-foreground mb-6">
            Start shopping for sustainable treasures!
          </p>
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
        {mockPurchases.map((purchase) => (
          <Card key={purchase.id} className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <img 
                  src={purchase.product.image} 
                  alt={purchase.product.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <Link 
                    to={`/product/${purchase.product.id}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {purchase.product.title}
                  </Link>
                  <Badge variant="secondary" className="ml-2">
                    {purchase.product.category}
                  </Badge>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </span>
                    <span className="text-lg font-display font-bold text-primary">
                      ${purchase.price}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Purchases;