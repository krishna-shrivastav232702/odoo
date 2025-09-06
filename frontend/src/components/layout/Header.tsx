import { Search, ShoppingCart, User, Leaf, Plus } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockCartItems } from '@/data/mockData';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = mockCartItems.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md shadow-subtle">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-display font-semibold text-primary hover:text-primary-light transition-colors"
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            EcoFinds
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search sustainable finds..." 
                className="pl-10 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {/* Add Product Button */}
            <Button 
              onClick={() => navigate('/add-product')}
              variant="outline"
              size="sm"
              className="hidden sm:flex gradient-primary text-primary-foreground border-0 hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Sell
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cart')}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Profile */}
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search sustainable finds..." 
              className="pl-10 border-border/50 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;