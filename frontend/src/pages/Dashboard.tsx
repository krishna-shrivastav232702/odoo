import { useState, useEffect } from 'react';
import { Edit, Save, Package, ShoppingCart, User, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product, Order } from '@/types';
import { productsAPI, ordersAPI } from '@/lib/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  
  const { toast } = useToast();
  const { itemCount } = useCart();
  const { user, updateProfile } = useAuth();

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initialize user info when user data is available
  useEffect(() => {
    if (user) {
      setUserInfo({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load user products and orders in parallel
      const [productsResponse, ordersResponse] = await Promise.all([
        productsAPI.getUserProducts(),
        ordersAPI.getOrders()
      ]);
      
      setUserProducts(productsResponse.data.products || productsResponse.data || []);
      setOrders(ordersResponse.data.orders || ordersResponse.data || []);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(userInfo);
      setIsEditing(false);
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  // Calculate statistics
  const totalEarnings = userProducts.reduce((sum, product) => {
    // Calculate earnings from sold products
    const soldProduct = orders.find(order => 
      order.orderItems.some(item => item.productId === product.id)
    );
    return sum + (soldProduct ? product.price : 0);
  }, 0);

  const totalPurchases = orders.reduce((sum, order) => sum + order.orderItems.length, 0);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-medium">{user.username}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <p className="font-medium">{user.email}</p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input 
                      value={userInfo.fullName}
                      onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="font-medium">{user.fullName || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  {isEditing ? (
                    <Input 
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="font-medium">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Address</Label>
                  {isEditing ? (
                    <Input 
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="font-medium">{user.address || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since
                  </Label>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics and Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-display font-bold text-primary">
                  {isLoading ? '...' : userProducts.length}
                </p>
                <p className="text-sm text-muted-foreground">Products Listed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-display font-bold text-primary">
                  {isLoading ? '...' : totalPurchases}
                </p>
                <p className="text-sm text-muted-foreground">Items Bought</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">$</span>
                </div>
                <p className="text-2xl font-display font-bold text-primary">
                  ${isLoading ? '...' : totalEarnings.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your EcoFinds experience</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
                <Link to="/add-product">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/my-listings">
                  <Edit className="w-4 h-4 mr-2" />
                  Manage Listings
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Cart ({itemCount})
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/purchases">
                  <Calendar className="w-4 h-4 mr-2" />
                  Purchase History
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : orders.length > 0 ? (
                orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">${order.totalAmount.toFixed(2)}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start shopping or listing products!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;