import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart?.(product);
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
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
              <Heart className="w-4 h-4" />
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
              className="gradient-primary text-primary-foreground border-0 hover:opacity-90"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default ProductCard;