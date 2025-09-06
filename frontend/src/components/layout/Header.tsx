import { ShoppingCart, User, Leaf, Plus, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModals } from '@/components/auth/AuthModals';


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { isAuthenticated, user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  const openSignInModal = () => {
    setAuthModalTab('signin');
    setIsAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    setAuthModalTab('signup');
    setIsAuthModalOpen(true);
  };

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
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  Hi, {user?.username}
                </span>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="gap-2"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={openSignInModal}
                  className="gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={openSignUpModal}
                  className="gap-2 gradient-primary text-primary-foreground border-0 hover:opacity-90"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Button>
              </div>
            )}
          </div>
        </div>


      </div>
      
      {/* Auth Modals */}
      <AuthModals 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </header>
  );
};

export default Header;