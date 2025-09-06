import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, User, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ProductLens } from '@/components/ProductLens';
import { mockProducts } from '@/data/mockData';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate('/')}>
          Return to Products
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from wishlist" : "Added to wishlist",
      description: isLiked 
        ? "Item removed from your wishlist." 
        : "Item saved to your wishlist.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image with Lens Effect */}
        <ProductLens 
          imageSrc={product.image} 
          imageAlt={product.title}
        />

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-display font-bold text-primary mb-4">
              {product.title}
            </h1>
            <p className="text-4xl font-display font-bold text-primary mb-4">
              ${product.price}
            </p>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {product.sellerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{product.sellerName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Listed on {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 gradient-primary text-primary-foreground border-0 hover:opacity-90"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLike}
              className={isLiked ? "text-red-500 border-red-500" : ""}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Product Description */}
          <div>
            <h2 className="text-xl font-display font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Sustainability Info */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h3 className="font-medium text-primary mb-2 flex items-center gap-2">
                🌱 Sustainability Impact
              </h3>
              <p className="text-sm text-muted-foreground">
                By purchasing this pre-loved item, you're helping extend its lifecycle and 
                reducing the demand for new production. This contributes to waste reduction 
                and supports the circular economy.
              </p>
            </CardContent>
          </Card>

          {/* Trust & Safety */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Trust & Safety
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  Verified seller
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  Secure payment processing
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  Return policy available
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;