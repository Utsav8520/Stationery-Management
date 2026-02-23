import { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash2, PlusCircle } from "lucide-react";

const AdminRidersPage = () => {
    const [riders, setRiders] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");

    useEffect(() => {
        const fetchRiders = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ page, limit: 10 });
                const data = await api.get(`/riders?${params.toString()}`);
                setRiders(data.riders);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Failed to fetch riders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRiders();
    }, [page]);

    const handleDeleteRider = async (riderId) => {
        if (window.confirm("Are you sure you want to delete this rider?")) {
            try {
                await api.delete(`/riders/${riderId}`);
                const params = new URLSearchParams({ page, limit: 10 });
                const data = await api.get(`/riders?${params.toString()}`);
                setRiders(data.riders);
                setPagination(data.pagination);
                alert("Rider deleted successfully!");
            } catch (error) {
                console.error("Failed to delete rider:", error);
                alert("Failed to delete rider.");
            }
        }
    };
    
    const getStatusColor = (status) => {
        const colors = {
            ACTIVE: "bg-green-500",
            INACTIVE: "bg-red-500",
        };
        return colors[status] || "bg-gray-500";
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Rider Management</h1>
                <Link to="/admin/riders/new">
                    <Button className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        Add New Rider
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Riders</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Vehicle</TableHead>
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
                            ) : riders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No riders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                riders.map((rider) => (
                                    <TableRow key={rider.id}>
                                        <TableCell>{rider.id}</TableCell>
                                        <TableCell className="font-medium">{rider.name}</TableCell>
                                        <TableCell>{rider.contact}</TableCell>
                                        <TableCell>{rider.vehicle}</TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(rider.status)} text-white`}>
                                                {rider.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button asChild variant="outline" size="icon">
                                                    <Link to={`/admin/riders/edit/${rider.id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDeleteRider(rider.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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
                                        setSearchParams({ page: page - 1 });
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
                                            setSearchParams({ page: i + 1 });
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
                                        setSearchParams({ page: page + 1 });
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

export default AdminRidersPage;