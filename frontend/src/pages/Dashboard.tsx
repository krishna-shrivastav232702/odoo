import { useState } from 'react';
import { Edit, Save, Package, ShoppingCart, User, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockUser, mockProducts, mockCartItems, mockPurchases } from '@/data/mockData';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(mockUser);
  const { toast } = useToast();

  const userProducts = mockProducts.filter(p => p.sellerId === mockUser.id);
  const totalEarnings = userProducts.reduce((sum, product) => sum + product.price, 0);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your profile information has been saved successfully.",
    });
  };

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
                  <AvatarImage src={userInfo.avatar} alt={userInfo.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {userInfo.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <Input 
                    value={userInfo.username}
                    onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                    className="text-center font-medium"
                  />
                ) : (
                  <h3 className="text-xl font-medium">{userInfo.username}</h3>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  {isEditing ? (
                    <Input 
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      type="email"
                    />
                  ) : (
                    <p className="font-medium">{userInfo.email}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since
                  </Label>
                  <p className="font-medium">
                    {new Date(userInfo.createdAt).toLocaleDateString()}
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
                <p className="text-2xl font-display font-bold text-primary">{userProducts.length}</p>
                <p className="text-sm text-muted-foreground">Products Listed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-display font-bold text-primary">{mockPurchases.length}</p>
                <p className="text-sm text-muted-foreground">Items Bought</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">$</span>
                </div>
                <p className="text-2xl font-display font-bold text-primary">${totalEarnings}</p>
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
                  View Cart ({mockCartItems.length})
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
              {mockPurchases.slice(0, 3).map((purchase) => (
                <div key={purchase.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <img 
                    src={purchase.product.image} 
                    alt={purchase.product.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{purchase.product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">${purchase.price}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;