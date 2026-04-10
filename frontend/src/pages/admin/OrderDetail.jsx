import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import api from "@/lib/api";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";


const orderStatusOptions = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const AdminOrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [riders, setRiders] = useState([]);
    const [selectedRider, setSelectedRider] = useState("");

    useEffect(() => {
        if (id) {
            fetchOrder();
            fetchRiders();
        }
    }, [id]);

    const fetchOrder = async () => {
        try {
            const data = await api.get(`/orders/${id}`);
            setOrder(data);
            setSelectedStatus(data.status);
            if (data.delivery?.riderId) {
                setSelectedRider(String(data.delivery.riderId));
            }
        } catch (error) {
            console.error("Failed to fetch order:", error);
            toast.error("Failed to fetch order details.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRiders = async () => {
        try {
            const data = await api.get("/riders");
            setRiders(data.riders || []);
        } catch (error) {
            console.error("Failed to fetch riders:", error);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/orders/${id}/status`, { status: selectedStatus });
            toast.success("Order status updated successfully!");
            fetchOrder(); // Refresh order details
        } catch (error) {
            console.error("Failed to update order status:", error);
            toast.error("Failed to update order status.");
        }
    };

    const handleAssignRider = async () => {
        console.log("handleAssignRider called", { selectedRider, orderDelivery: order?.delivery });
        if (!selectedRider) {
            toast.error("Please select a rider to assign.");
            return;
        }
        try {
            // This assumes a delivery record is created when the order is.
            // If not, this logic needs to be more robust (e.g., create if not exists)
            if (order.delivery) {
                console.log("Assigning rider...", selectedRider);
                await api.put(`/deliveries/${order.delivery.id}/assign`, {
                    riderId: parseInt(selectedRider),
                });
                toast.success("Rider assigned successfully!");
                fetchOrder(); // Refresh order details
            } else {
                console.error("No delivery record found");
                toast.error("No delivery record found for this order to assign a rider.");
            }
        } catch (error) {
            console.error("Failed to assign rider:", error);
            toast.error(error.message || "Failed to assign rider.");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: "bg-amber-500",
            PAID: "bg-blue-500",
            PROCESSING: "bg-purple-500",
            SHIPPED: "bg-indigo-500",
            DELIVERED: "bg-green-500",
            CANCELLED: "bg-red-500",
        };
        return colors[status] || "bg-gray-500";
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-8">Loading Order...</h1>
                    <Card className="animate-pulse">
                        <CardHeader><div className="h-8 bg-muted rounded w-1/2"></div></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="h-6 bg-muted rounded"></div>
                            <div className="h-6 bg-muted rounded w-3/4"></div>
                            <div className="h-6 bg-muted rounded w-1/2"></div>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        );
    }

    if (!order) {
        return (
            <AdminLayout>
                <div className="p-8 text-center">
                    <h1 className="text-3xl font-bold mb-8">Order Not Found</h1>
                    <Button asChild>
                        <Link to="/admin/orders"><ArrowLeft className="mr-2 h-4 w-4" />Back to Orders</Link>
                    </Button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <Button asChild variant="outline" size="sm" className="mb-4">
                        <Link to="/admin/orders">
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
                        <Badge className={`${getStatusColor(order.status)} text-white text-lg mt-2 md:mt-0`}>{order.status}</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Items */}
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
                                                            ? (item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `${import.meta.env.VITE_BACKEND_URL}${item.product.imageUrl}`)
                                                            : "/placeholder.svg"
                                                    }
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <p className="font-semibold">{item.product.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Qty: {item.quantity} @ Rs. {item.price.toFixed(2)}
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

                    {/* Right Column: Info & Actions */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <span>{order.user ? order.user.name : "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <span>{order.user ? order.user.email : "N/A"}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                    <span>{order.deliveryAddress || "No address provided."}</span>
                                 </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground space-y-1">
                                    <p className="font-semibold">System Flow:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Assigning a Rider sets Order to <span className="font-medium text-primary">SHIPPED</span>.</li>
                                        <li>Delivery <span className="font-medium text-green-600">DELIVERED</span> sets Order to <span className="font-medium text-green-600">DELIVERED</span>.</li>
                                        <li>Delivery <span className="font-medium text-red-600">FAILED</span> sets Order to <span className="font-medium text-red-600">CANCELLED</span>.</li>
                                    </ul>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Update Status</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {orderStatusOptions.map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button onClick={handleUpdateStatus}>Update</Button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Assign Rider</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Select value={selectedRider} onValueChange={setSelectedRider}>
                                            <SelectTrigger><SelectValue placeholder="Select a rider" /></SelectTrigger>
                                            <SelectContent>
                                                {riders.map((rider) => (
                                                    <SelectItem key={rider.id} value={String(rider.id)}>{rider.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button onClick={handleAssignRider}>Assign</Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <p className="text-xs text-muted-foreground">
                                    Current Rider: {order.delivery?.rider?.name || "Not Assigned"}
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrderDetailPage;
