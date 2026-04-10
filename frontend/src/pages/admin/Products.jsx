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
import { Edit, Trash2, PlusCircle, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce"; // A custom hook for debouncing input

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const page = parseInt(searchParams.get("page") || "1");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page,
                    limit: 10,
                });
                if (debouncedSearchTerm) {
                    params.append("search", debouncedSearchTerm);
                }
                const data = await api.get(`/products?${params.toString()}`);
                setProducts(data.products);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
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


    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${productId}`);
                // Refetch products on the current page
                const params = new URLSearchParams({ page, limit: 10 });
                if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
                const data = await api.get(`/products?${params.toString()}`);
                setProducts(data.products);
                setPagination(data.pagination);

                alert("Product deleted successfully!");
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Failed to delete product.");
            }
        }
    };

    const getStockBadge = (stock) => {
        if (stock === 0) {
            return <Badge variant="destructive">Out of Stock</Badge>;
        }
        if (stock < 10) {
            return <Badge variant="secondary">Low Stock</Badge>;
        }
        return <Badge variant="default">In Stock</Badge>;
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <Link to="/admin/products/new">
                    <Button className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        Add New Product
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Products</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
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
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6} className="h-20 text-center">
                                            <div className="animate-pulse bg-muted h-10 rounded-md"></div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <img
                                                src={
                                                    product.imageUrl
                                                        ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${import.meta.env.VITE_BACKEND_URL}${product.imageUrl}`)
                                                        : "/placeholder.svg"
                                                }
                                                alt={product.name}
                                                className="h-16 w-16 object-cover rounded-lg"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{product.name}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-1" title={product.description}>
                                                    {product.description || "No description"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>Rs. {product.price.toFixed(2)}</TableCell>
                                        <TableCell>{getStockBadge(product.stock)}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button asChild variant="outline" size="icon">
                                                    <Link to={`/admin/products/edit/${product.id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDeleteProduct(product.id)}
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

export default AdminProductsPage;
