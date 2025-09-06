import { Heart, ShoppingCart, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setIsAdded(true);
    toast({
      title: "Added to cart!",
      description: `${product.title} has been added to your cart.`,
    });
    
    // Reset the button after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    toast({
      title: isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist",
      description: isInWishlist(product.id) 
        ? "Item removed from your wishlist." 
        : "Item saved to your wishlist.",
    });
  };

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-0 border overflow-hidden">
        
        {/* Product Image */}
        <CardItem translateZ="100" className="w-full">
          <Link to={`/product/${product.id}`}>
            <div className="aspect-square overflow-hidden rounded-t-xl">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        </CardItem>
        
        {/* Card Content */}
        <div className="p-4">
          {/* Category and Heart */}
          <CardItem translateZ="50" className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 hover:text-primary ${isInWishlist(product.id) ? 'text-red-500' : ''}`}
              onClick={handleToggleWishlist}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </Button>
          </CardItem>

          {/* Product Title */}
          <CardItem translateZ="60">
            <Link to={`/product/${product.id}`}>
              <h3 className="font-medium text-card-foreground group-hover/card:text-primary transition-colors mb-2 line-clamp-2">
                {product.title}
              </h3>
            </Link>
          </CardItem>

          {/* Price and Add to Cart */}
          <CardItem translateZ="40" className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-display font-semibold text-primary">
                ${product.price}
              </p>
              <p className="text-xs text-muted-foreground">
                by {product.sellerName}
              </p>
            </div>

            <Button 
              onClick={handleAddToCart}
              size="sm"
              className={`${isAdded ? 'bg-green-600 hover:bg-green-700' : 'gradient-primary hover:opacity-90'} text-primary-foreground border-0 transition-all duration-200`}
              disabled={isAdded}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default ProductCard;