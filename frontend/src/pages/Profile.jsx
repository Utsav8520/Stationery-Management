import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import {
  User,
  Package,
  MapPin,
  Calendar,
  Mail,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const data = await api.get("/orders");
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-amber-500",
      PAID: "bg-blue-500",
      PROCESSING: "bg-purple-500",
      SHIPPED: "bg-indigo-500",
      DELIVERED: "bg-green-500",
      CANCELLED: "bg-red-500"
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: Clock,
      PAID: CheckCircle,
      PROCESSING: Package,
      SHIPPED: Truck,
      DELIVERED: CheckCircle,
      CANCELLED: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your profile and orders</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-semibold">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-semibold">{user.address || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-semibold">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={() => toast.info("Edit profile feature coming soon")}>
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{orders.length}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {orders.filter(o => o.status === "DELIVERED").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {orders.filter(o => o.status === "PENDING" || o.status === "PROCESSING").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Button onClick={() => navigate("/products")}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold">Order #{order.id}</h3>
                              <Badge className={`${getStatusColor(order.status)} text-white`}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              Rs. {order.totalAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items?.length || 0} items
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{order.deliveryAddress || user.address}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Change Password</h4>
                      <p className="text-sm text-muted-foreground">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => toast.info("Feature coming soon")}>
                      Change
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your orders via email
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => toast.info("Feature coming soon")}>
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive" onClick={() => toast.error("Feature coming soon")}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
