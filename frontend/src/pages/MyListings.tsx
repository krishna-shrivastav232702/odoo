import { useState } from 'react';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { mockProducts, mockUser } from '@/data/mockData';
import { Product } from '@/types';
import { Link } from 'react-router-dom';

const MyListings = () => {
  const [listings, setListings] = useState<Product[]>(
    mockProducts.filter(p => p.sellerId === mockUser.id)
  );
  const { toast } = useToast();

  const handleDelete = (productId: string) => {
    setListings(listings.filter(product => product.id !== productId));
    toast({
      title: "Listing deleted",
      description: "Your product listing has been removed successfully.",
    });
  };

  const handleEdit = (productId: string) => {
    toast({
      title: "Edit mode",
      description: "Edit functionality would be implemented here.",
    });
  };

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
              Create First Listing
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            My Listings
          </h1>
          <p className="text-muted-foreground">
            Manage your product listings and track their performance
          </p>
        </div>
        
        <Button asChild className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
          <Link to="/add-product">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-display font-bold text-primary">{listings.length}</p>
            <p className="text-sm text-muted-foreground">Active Listings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-display font-bold text-primary">
              ${listings.reduce((sum, product) => sum + product.price, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-display font-bold text-success">Active</p>
            <p className="text-sm text-muted-foreground">Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Listings Grid */}
      <div className="grid gap-6">
        {listings.map((product) => (
          <Card key={product.id} className="shadow-medium hover:shadow-strong transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link 
                        to={`/product/${product.id}`}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {product.title}
                      </Link>
                      <Badge variant="secondary" className="ml-2">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold text-primary">
                        ${product.price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Listed {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete listing?</AlertDialogTitle>
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

                    <Badge 
                      variant="outline"
                      className="ml-auto text-success border-success"
                    >
                      Active
                    </Badge>
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

export default MyListings;