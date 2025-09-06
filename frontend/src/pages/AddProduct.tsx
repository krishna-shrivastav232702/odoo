import { useState } from 'react';
import { ArrowLeft, Upload, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from '@/types';
import { Link, useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: ''
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    toast({
      title: "Product listed successfully!",
      description: "Your item is now available for purchase.",
    });
    
    navigate('/my-listings');
  };

  const handleImageUpload = () => {
    // In a real app, this would handle file upload
    setFormData(prev => ({
      ...prev,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
    }));
    toast({
      title: "Image uploaded",
      description: "Product image has been added successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            List Your Item
          </h1>
          <p className="text-muted-foreground">
            Give your pre-loved items a new life and help build a sustainable future
          </p>
        </div>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Details
          </CardTitle>
          <CardDescription>
            Fill in the information about your item
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Vintage Leather Jacket"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the condition, history, and any special features of your item..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {formData.image ? (
                  <div className="space-y-4">
                    <img 
                      src={formData.image} 
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-md mx-auto"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleImageUpload}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Add Product Image</p>
                      <p className="text-sm text-muted-foreground">
                        Upload a clear photo of your item
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleImageUpload}
                    >
                      Upload Image (Placeholder)
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sustainability Note */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-medium text-primary mb-2">🌱 Sustainability Impact</h3>
              <p className="text-sm text-muted-foreground">
                By listing your item on EcoFinds, you're contributing to the circular economy 
                and helping reduce waste. Thank you for making a positive environmental impact!
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full gradient-primary text-primary-foreground border-0 hover:opacity-90"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Listing...' : 'List Item'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;