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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Edit, Trash2, PlusCircle, Eye, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const AdminCreditPartiesPage = () => {
    const [parties, setParties] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const page = parseInt(searchParams.get("page") || "1");

    useEffect(() => {
        const fetchParties = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page,
                    limit: 10,
                });
                if (debouncedSearchTerm) {
                    params.append("search", debouncedSearchTerm);
                }
                const data = await api.get(`/credits/parties?${params.toString()}`);
                setParties(data.parties);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Failed to fetch credit parties:", error);
                setParties([]); // Clear parties on error
            } finally {
                setLoading(false);
            }
        };
        fetchParties();
    }, [page, debouncedSearchTerm]);

    useEffect(() => {
        setSearchParams(
            (prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set("page", "1");
                if (searchTerm) {
                    newParams.set("search", searchTerm);
                } else {
                    newParams.delete("search");
                }
                return newParams;
            },
            { replace: true }
        );
    }, [debouncedSearchTerm]);
    
    const handleDeleteParty = async (partyId) => {
        if (window.confirm("Are you sure you want to delete this credit party?")) {
            try {
                await api.delete(`/credits/parties/${partyId}`);
                // Refetch parties on the current page
                const params = new URLSearchParams({ page, limit: 10 });
                if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
                const data = await api.get(`/credits/parties?${params.toString()}`);
                setParties(data.parties);
                setPagination(data.pagination);
                alert("Credit party deleted successfully!");
            } catch (error) {
                console.error("Failed to delete credit party:", error);
                alert("Failed to delete credit party.");
            }
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Credit Parties</h1>
                <Link to="/admin/credits/parties/new">
                    <Button className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        Add New Party
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Credit Parties</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search parties..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Actions</TableHead>
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
                            ) : parties.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No credit parties found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                parties.map((party) => (
                                    <TableRow key={party.id}>
                                        <TableCell>{party.id}</TableCell>
                                        <TableCell className="font-medium">{party.name}</TableCell>
                                        <TableCell>{party.contact}</TableCell>
                                        <TableCell>
                                            <Badge variant={party.type === 'Supplier' ? 'default' : 'secondary'}>
                                                {party.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button asChild variant="outline" size="icon">
                                                    <Link to={`/admin/credits/parties/${party.id}/transactions`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button asChild variant="outline" size="icon">
                                                    <Link to={`/admin/credits/parties/edit/${party.id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDeleteParty(party.id)}
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
                                        setSearchParams({ page: page - 1, search: searchTerm });
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
                                            setSearchParams({ page: i + 1, search: searchTerm });
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
                                        setSearchParams({ page: page + 1, search: searchTerm });
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

export default AdminCreditPartiesPage;
