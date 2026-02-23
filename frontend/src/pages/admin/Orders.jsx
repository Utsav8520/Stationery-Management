import { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import api from "@/lib/api";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, ChevronsRight } from "lucide-react";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");
    const status = searchParams.get("status") || "ALL";

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page,
                    limit: 10,
                });
                if (status !== "ALL") {
                    params.append("status", status);
                }
                const data = await api.get(`/orders?${params.toString()}`);
                setOrders(data.orders);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page, status]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setSearchParams({ page: newPage, status });
        }
    };

    const handleStatusChange = (newStatus) => {
        setSearchParams({ page: 1, status: newStatus });
    };

    const getStatusColor = (orderStatus) => {
        const colors = {
            PENDING: "bg-amber-500",
            PAID: "bg-blue-500",
            PROCESSING: "bg-purple-500",
            SHIPPED: "bg-indigo-500",
            DELIVERED: "bg-green-500",
            CANCELLED: "bg-red-500",
        };
        return colors[orderStatus] || "bg-gray-500";
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Order Management</h1>
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6} className="h-16 text-center">
                                            <div className="animate-pulse bg-muted h-6 rounded-md"></div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>{order.user ? order.user.name : "N/A"}</TableCell>
                                        <TableCell>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>Rs. {order.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button asChild variant="outline" size="sm">
                                                <Link to={`/admin/orders/${order.id}`} className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
        </AdminLayout>
    );
};

export default AdminOrdersPage;