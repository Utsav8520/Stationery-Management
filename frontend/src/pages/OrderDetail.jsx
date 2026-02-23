import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, CheckCircle, Truck, Clock, XCircle } from "lucide-react";

const OrderStatusTimeline = ({ status }) => {
    // Map internal statuses to display steps
    const steps = [
        { status: "PENDING", label: "Order Placed", icon: Clock },
        { status: "PAID", label: "Paid", icon: CheckCircle },
        { status: "PROCESSING", label: "Processing", icon: Package },
        { status: "SHIPPED", label: "Out for Delivery", icon: Truck },
        { status: "DELIVERED", label: "Delivered", icon: CheckCircle },
    ];

    const currentStatusIndex = steps.findIndex(s => s.status === status);

    // Handle Cancelled separately
    if (status === "CANCELLED") {
        return (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center">
                    <XCircle className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-semibold text-destructive">Order Cancelled</p>
                    <p className="text-sm text-muted-foreground">This order has been cancelled.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between relative">
            {/* Progress Bar Background */}
            <div className="absolute top-5 left-0 w-full h-1 bg-muted -z-0" />

            {/* Active Progress Bar */}
            <div
                className="absolute top-5 left-0 h-1 bg-primary -z-0 transition-all duration-500"
                style={{
                    width: `${(Math.max(0, currentStatusIndex) / (steps.length - 1)) * 100}%`
                }}
            />

            {steps.map((step, index) => {
                const isActive = index <= currentStatusIndex;
                const isCompleted = index < currentStatusIndex;
                const Icon = step.icon;

                return (
                    <div key={step.status} className="flex-1 flex flex-col items-center relative z-10">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-4 border-background
                                ${isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                        </div>
                        <p
                            className={`mt-2 text-xs font-semibold text-center ${isActive ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            {step.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8">
                    <p>Loading order details...</p>
                </div>
            </MainLayout>
        );
    }

    if (!order) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-3xl font-bold mb-8">Order Not Found</h1>
                    <p>We couldn't find the order you're looking for.</p>
                    <Button asChild className="mt-4">
                        <Link to="/orders">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div>
                    <Button asChild variant="outline" size="sm" className="mb-4">
                        <Link to="/orders">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
                            <p className="text-muted-foreground">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <Badge className="text-lg mt-2 md:mt-0">{order.status}</Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderStatusTimeline status={order.status} />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.productId} className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={
                                                        item.product.imageUrl
                                                            ? `${import.meta.env.VITE_BACKEND_URL}${item.product.imageUrl
                                                            }`
                                                            : "/placeholder.svg"
                                                    }
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <Link to={`/products/${item.productId}`} className="font-semibold hover:text-primary transition-colors">
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="font-semibold">
                                                Rs. {(item.quantity * item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p>Rs. {order?.totalAmount?.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Shipping</p>
                                    <p>Free</p>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Total</p>
                                    <p>Rs. {order?.totalAmount?.toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Method</p>
                                    <p className="font-medium">{order?.payment?.method || "N/A"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Status</p>
                                    <Badge variant={order?.payment?.status === "SUCCESS" ? "default" : "secondary"}>
                                        {order?.payment?.status || "PENDING"}
                                    </Badge>
                                </div>
                                {order?.payment?.pidx && (
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Transaction ID</p>
                                        <p className="font-mono text-xs truncate max-w-[150px]" title={order.payment.pidx}>
                                            {order.payment.pidx}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Shipping Address</p>
                                    <p>{order?.deliveryAddress || order?.delivery?.address || "Address not provided."}</p>
                                </div>

                                <Separator />

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Delivery Status</p>
                                    <Badge variant="outline">{order?.delivery?.status || "PENDING"}</Badge>
                                </div>

                                {order?.delivery?.rider && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-2">Rider Details</p>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Name:</span>
                                                    <span>{order.delivery.rider.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Contact:</span>
                                                    <span>{order.delivery.rider.contact}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Vehicle:</span>
                                                    <span>{order.delivery.rider.vehicle}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default OrderDetailPage;
