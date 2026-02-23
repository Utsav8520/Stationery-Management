import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    Truck,
    DollarSign,
    AlertTriangle,
    Plus
} from "lucide-react";
import api from "@/lib/api";

const AdminDashboardPage = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        lowStockProducts: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            // Fetch products
            const productsData = await api.get("/products?limit=1000");
            const products = productsData.products || [];

            // Fetch orders
            const ordersData = await api.get("/orders?limit=1000");
            const orders = ordersData.orders || [];

            // Calculate stats
            const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
            const pending = orders.filter(o => o.status === "PENDING").length;
            const revenue = orders
                .filter(o => o.status === "PAID" || o.status === "DELIVERED")
                .reduce((sum, o) => sum + o.totalAmount, 0);

            setStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                totalUsers: 0, // Would need users endpoint
                totalRevenue: revenue,
                lowStockProducts: lowStock,
                pendingOrders: pending
            });
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: Package,
            gradient: "from-blue-500 to-cyan-500",
            link: "/admin/products"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingCart,
            gradient: "from-purple-500 to-pink-500",
            link: "/admin/orders"
        },
        {
            title: "Total Revenue",
            value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            gradient: "from-green-500 to-emerald-500",
            link: "/admin/analytics"
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders,
            icon: Truck,
            gradient: "from-amber-500 to-orange-500",
            link: "/admin/orders"
        }
    ];

    const quickActions = [
        {
            title: "Add New Product",
            description: "Create a new product listing",
            icon: Package,
            link: "/admin/products/new",
            color: "bg-blue-500"
        },
        {
            title: "View Orders",
            description: "Manage customer orders",
            icon: ShoppingCart,
            link: "/admin/orders",
            color: "bg-purple-500"
        },
        {
            title: "Manage Riders",
            description: "Add or edit delivery riders",
            icon: Truck,
            link: "/admin/riders",
            color: "bg-green-500"
        },
        {
            title: "View Analytics",
            description: "Check sales and performance",
            icon: TrendingUp,
            link: "/admin/analytics",
            color: "bg-amber-500"
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome to your admin dashboard</p>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Link key={stat.title} to={stat.link}>
                                    <Card className="hover-lift cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                                {stat.title}
                                            </CardTitle>
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-3xl font-bold">{stat.value}</div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Alerts */}
                {stats.lowStockProducts > 0 && (
                    <Card className="border-amber-500/50 bg-amber-500/5">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                <CardTitle className="text-amber-700 dark:text-amber-400">
                                    Low Stock Alert
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                You have <span className="font-bold text-amber-600">{stats.lowStockProducts}</span> products with low stock (10 or fewer items).
                            </p>
                            <Link to="/admin/products">
                                <Button variant="outline" className="mt-4 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white">
                                    View Products
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.title} to={action.link}>
                                    <Card className="hover-lift cursor-pointer h-full">
                                        <CardContent className="p-6">
                                            <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="font-bold mb-2">{action.title}</h3>
                                            <p className="text-sm text-muted-foreground">{action.description}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">New orders received</p>
                                    <p className="text-sm text-muted-foreground">{stats.pendingOrders} pending orders</p>
                                </div>
                                <Link to="/admin/orders">
                                    <Button variant="outline" size="sm">View</Button>
                                </Link>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Low stock products</p>
                                    <p className="text-sm text-muted-foreground">{stats.lowStockProducts} products need restocking</p>
                                </div>
                                <Link to="/admin/products">
                                    <Button variant="outline" size="sm">View</Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;
