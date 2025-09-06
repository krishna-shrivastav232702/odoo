import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, User, Calendar, Shield, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProductLens } from '@/components/ProductLens';
import { Product } from '@/types';
import { productsAPI, chatAPI } from '@/lib/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isContactingSeller, setIsContactingSeller] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getProduct(id!);
      setProduct(response.data.product);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load product',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !isAuthenticated) {
      if (!isAuthenticated) {
        navigate('/auth');
        return;
      }
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(product, 1);
    } catch (error) {
      // Error handling is done in the addItem function
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleContactSeller = async () => {
    if (!product || !isAuthenticated) {
      if (!isAuthenticated) {
        navigate('/auth');
        return;
      }
      return;
    }

    if (product.seller.id === user?.id) {
      toast({
        title: 'Cannot contact yourself',
        description: 'You cannot start a conversation with yourself.',
        variant: 'destructive',
      });
      return;
    }

    setIsContactingSeller(true);
    try {
      const response = await chatAPI.startConversation(product.seller.id, product.id);
      toast({
        title: 'Conversation started',
        description: 'You can now chat with the seller.',
      });
      navigate('/chat');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to start conversation',
        variant: 'destructive',
      });
    } finally {
      setIsContactingSeller(false);
    }
  };

  const handleToggleWishlist = () => {
    if (!product || !isAuthenticated) {
      if (!isAuthenticated) {
        navigate('/auth');
        return;
      }
      return;
    }

    toggleWishlist(product);
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/')}>
            Go back to products
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === product.seller.id;
  const isProductInWishlist = isInWishlist(product.id.toString());

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            <ProductLens 
              imageSrc={product.imageUrls[0] || '/placeholder.svg'} 
              imageAlt={product.title}
            />
            <Badge 
              variant={product.status === 'available' ? 'default' : 'secondary'}
              className="absolute top-4 right-4"
            >
              {product.status}
            </Badge>
          </div>
          
          {product.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.imageUrls.slice(1, 5).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.title} ${index + 2}`}
                  className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl font-display font-bold text-primary">
                ${product.price}
              </span>
              <Badge variant="outline">
                {product.category.name}
              </Badge>
              <Badge 
                variant={product.condition === 'new' ? 'default' : 'secondary'}
              >
                {product.condition.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {product.seller.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{product.seller.username}</h4>
                  {product.seller.fullName && (
                    <p className="text-sm text-muted-foreground">{product.seller.fullName}</p>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    Member since {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isOwner && product.status === 'available' && (
              <>
                <Button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full gradient-primary text-primary-foreground border-0 hover:opacity-90"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleToggleWishlist}
                    className="flex-1"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isProductInWishlist ? 'fill-current text-red-500' : ''}`} />
                    {isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleContactSeller}
                    disabled={isContactingSeller}
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {isContactingSeller ? 'Connecting...' : 'Contact Owner'}
                  </Button>
                </div>

                {/* Additional Product Interest Section */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Interested in this item?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect directly with the owner to ask questions, negotiate, or arrange viewing.
                  </p>
                  <Button 
                    variant="default"
                    onClick={handleContactSeller}
                    disabled={isContactingSeller}
                    className="w-full"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {isContactingSeller ? 'Starting Conversation...' : 'Start Conversation'}
                  </Button>
                </div>
              </>
            )}

            {isOwner && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This is your listing. You can manage it from your{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/my-listings')}>
                    My Listings
                  </Button>{' '}
                  page.
                </p>
              </div>
            )}

            {!isAuthenticated && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to add this item to your cart or contact the seller.
                </p>
                <Button onClick={() => navigate('/auth')} className="w-full">
                  Sign In
                </Button>
              </div>
            )}
          </div>

          {/* Trust & Safety */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Trust & Safety</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Verified seller profile
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Secure payment processing
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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