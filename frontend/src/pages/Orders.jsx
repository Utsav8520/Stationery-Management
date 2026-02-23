import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import api from "@/lib/api";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ShoppingBag, ArrowRight } from "lucide-react";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page = parseInt(searchParams.get("page") || "1");

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await api.get(`/orders?page=${page}&limit=5`);
                setOrders(data.orders);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setSearchParams({ page: newPage });
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
            <MainLayout>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="h-24 animate-pulse bg-muted" />
                        ))}
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (orders.length === 0) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8 text-center">
                    <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
                    <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
                    <p className="text-muted-foreground mb-6">
                        You haven't placed any orders. When you do, they'll show up here.
                    </p>
                    <Button onClick={() => navigate("/products")}>
                        Start Shopping
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                            <Link to={`/orders/${order.id}`}>
                                <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                    <div className="font-semibold">
                                        <p className="text-sm text-muted-foreground">Order ID</p>
                                        <p>#{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date</p>
                                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-sm text-muted-foreground">Total</p>
                                        <p>Rs. {order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(page - 1);
                                        }}
                                        disabled={page <= 1}
                                    />
                                </PaginationItem>
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(i + 1);
                                            }}
                                            isActive={page === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(page + 1);
                                        }}
                                        disabled={page >= pagination.totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default OrdersPage;