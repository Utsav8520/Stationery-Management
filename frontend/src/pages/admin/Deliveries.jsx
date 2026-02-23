import { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Link, useSearchParams } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

const AdminDeliveriesPage = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");

    useEffect(() => {
        const fetchDeliveries = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page,
                    limit: 10,
                });
                const data = await api.get(`/deliveries?${params.toString()}`);
                setDeliveries(data.deliveries);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Failed to fetch deliveries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveries();
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setSearchParams({ page: newPage });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: "bg-amber-500",
            OUT_FOR_DELIVERY: "bg-blue-500",
            DELIVERED: "bg-green-500",
            FAILED: "bg-red-500",
        };
        return colors[status] || "bg-gray-500";
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Delivery Management</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Deliveries</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Rider</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5} className="h-16 text-center">
                                            <div className="animate-pulse bg-muted h-6 rounded-md"></div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : deliveries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No deliveries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                deliveries.map((delivery) => (
                                    <TableRow key={delivery.id}>
                                        <TableCell className="font-medium">
                                            <Link to={`/admin/orders/${delivery.order.id}`} className="text-primary hover:underline">
                                                #{delivery.order.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{delivery.order.user ? delivery.order.user.name : 'N/A'}</TableCell>
                                        <TableCell>{delivery.rider ? delivery.rider.name : 'Not Assigned'}</TableCell>
                                        <TableCell>{delivery.address}</TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(delivery.status)} text-white`}>
                                                {delivery.status}
                                            </Badge>
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

export default AdminDeliveriesPage;
