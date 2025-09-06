import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/types';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '@/lib/api';

const AddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    condition: '',
    price: '',
    imageUrls: [] as string[]
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.categoryId || !formData.price || !formData.condition) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await productsAPI.createProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        condition: formData.condition,
        imageUrls: formData.imageUrls
      });

      toast({
        title: "Product listed successfully!",
        description: "Your item is now available for purchase.",
      });
      
      navigate('/my-listings');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await productsAPI.uploadImages(formData);
      const newImageUrls = response.data.imageUrls;
      
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...newImageUrls]
      }));

      toast({
        title: "Images uploaded",
        description: `${newImageUrls.length} image(s) uploaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.response?.data?.error || "Failed to upload images.",
        variant: "destructive",
      });
    }
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
                value={formData.categoryId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like_new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
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
              <Label htmlFor="images">Product Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload product images
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB each
                  </p>
                </label>
              </div>
              
              {formData.imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
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
            <div className="flex gap-4 pt-4">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/my-listings">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Link>
              </Button>
              
              <Button 
                type="submit" 
                className="flex-1 gradient-primary text-primary-foreground border-0 hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Package className="w-4 h-4 mr-2 animate-spin" />
                    Listing Product...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    List Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;