import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { Link } from 'react-router-dom';
import { productsAPI } from '@/lib/api';

const MyListings = () => {
  const [listings, setListings] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user products on mount
  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getUserProducts();
      setListings(response.data.products || response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load listings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await productsAPI.deleteProduct(productId.toString());
      setListings(listings.filter(product => product.id !== productId));
      toast({
        title: "Listing deleted",
        description: "Your product has been removed from the marketplace.",
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete product',
        variant: 'destructive',
      });
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

  if (listings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold mb-2">No listings yet</h1>
          <p className="text-muted-foreground mb-6">
            Start selling your pre-loved items and contribute to the circular economy!
          </p>
          <Button asChild className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
            <Link to="/add-product">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Listing
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            My Listings
          </h1>
          <p className="text-muted-foreground">
            Manage your products and track their performance
          </p>
        </div>
        
        <Button asChild className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
          <Link to="/add-product">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((product) => (
          <Card key={product.id} className="shadow-medium hover:shadow-strong transition-shadow">
            <div className="relative">
              <img 
                src={product.imageUrls[0] || '/placeholder.svg'} 
                alt={product.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge 
                variant={product.status === 'available' ? 'default' : 'secondary'} 
                className="absolute top-2 right-2"
              >
                {product.status}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-display font-bold text-primary">
                  ${product.price}
                </span>
                <Badge variant="outline">{product.category.name}</Badge>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    // Navigate to edit page (you can implement this)
                    toast({
                      title: "Edit feature",
                      description: "Edit functionality coming soon!",
                    });
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{product.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyListings;