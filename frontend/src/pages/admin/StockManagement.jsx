import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
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
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

const StockManagement = () => {
    const [activeTab, setActiveTab] = useState("inventory");

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Stock Management</h1>
                    <p className="text-muted-foreground">Manage inventory, track history, and perform bulk operations.</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="bulk-add">Bulk Add</TabsTrigger>
                        <TabsTrigger value="bulk-reduce">Bulk Reduce</TabsTrigger>
                    </TabsList>

                    <TabsContent value="inventory" className="space-y-4">
                        <InventoryTab />
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        <HistoryTab />
                    </TabsContent>

                    <TabsContent value="bulk-reduce" className="space-y-4">
                        <BulkOperationTab mode="reduce" />
                    </TabsContent>

                    <TabsContent value="bulk-add" className="space-y-4">
                        <BulkOperationTab mode="add" />
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

const InventoryTab = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [search, page]);

    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products?search=${search}&page=${page}&limit=10`);
            setProducts(res.products);
            setPagination(res.pagination);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Inventory</CardTitle>
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Product Details</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <img
                                        src={
                                            product.imageUrl
                                                ? `${import.meta.env.VITE_BACKEND_URL}${product.imageUrl}`
                                                : "/placeholder.svg"
                                        }
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded-md"
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
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal">
                                        {product.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>Rs. {product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    {product.stock < 10 ? (
                                        <Badge variant="destructive">Low Stock</Badge>
                                    ) : (
                                        <Badge variant="outline">In Stock</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <span className="px-4 text-sm">Page {page} of {pagination.totalPages}</span>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                        className={page >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const HistoryTab = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchHistory();
    }, [page]);

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/admin/stock/history?page=${page}&limit=10`);
            setHistory(res.history);
            setPagination(res.pagination);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Stock History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Product Details</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Change</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <img
                                        src={
                                            item.product?.imageUrl
                                                ? `${import.meta.env.VITE_BACKEND_URL}${item.product.imageUrl}`
                                                : "/placeholder.svg"
                                        }
                                        alt={item.product?.name || "Product"}
                                        className="w-10 h-10 object-cover rounded-md"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.product?.name || "Unknown Product"}</span>
                                        <span className="text-xs text-muted-foreground line-clamp-1" title={item.product?.description}>
                                            {item.product?.description || "No description"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal">
                                        {item.product?.category || "N/A"}
                                    </Badge>
                                </TableCell>
                                <TableCell className={item.change > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                    {item.change > 0 ? "+" : ""}{item.change}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{item.reason}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {new Date(item.createdAt).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <span className="px-4 text-sm">Page {page} of {pagination.totalPages}</span>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                        className={page >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const BulkOperationTab = ({ mode }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]); // [{ id, name, quantity, imageUrl, description }]
    const [search, setSearch] = useState("");
    const [reason, setReason] = useState("");
    const isAdd = mode === "add";

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products?search=${search}&limit=10`);
            setProducts(res.products);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const addProduct = (product) => {
        if (!selectedProducts.find((p) => p.id === product.id)) {
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
        }
    };

    const removeProduct = (id) => {
        setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        setSelectedProducts(
            selectedProducts.map((p) => (p.id === id ? { ...p, quantity: parseInt(quantity) || 1 } : p))
        );
    };

    const handleSubmit = async () => {
        if (selectedProducts.length === 0) {
            toast.error("Please select products.");
            return;
        }
        if (!reason) {
            toast.error("Please provide a reason.");
            return;
        }

        try {
            const items = selectedProducts.map((p) => ({ id: p.id, quantity: p.quantity }));
            const endpoint = isAdd ? "/admin/stock/bulk-add" : "/admin/stock/bulk-reduce";
            await api.post(endpoint, { items, reason });
            toast.success(`Stock ${isAdd ? "added" : "reduced"} successfully!`);
            setSelectedProducts([]);
            setReason("");
        } catch (error) {
            console.error(`Failed to ${mode} stock:`, error);
            toast.error(`Failed to ${mode} stock.`);
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Select Products to {isAdd ? "Add" : "Reduce"}</CardTitle>
                    <Input
                        placeholder="Search to add..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-3 p-2 border rounded hover:bg-accent cursor-pointer"
                                onClick={() => addProduct(product)}
                            >
                                <img
                                    src={
                                        product.imageUrl
                                            ? `${import.meta.env.VITE_BACKEND_URL}${product.imageUrl}`
                                            : "/placeholder.svg"
                                    }
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                                </div>
                                <Badge variant="secondary" className="text-xs">Stock: {product.stock}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Review & Submit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {selectedProducts.map((p) => (
                            <div key={p.id} className="flex items-center gap-2 p-2 border rounded">
                                <img
                                    src={
                                        p.imageUrl
                                            ? `${import.meta.env.VITE_BACKEND_URL}${p.imageUrl}`
                                            : "/placeholder.svg"
                                    }
                                    alt={p.name}
                                    className="w-8 h-8 object-cover rounded-md"
                                />
                                <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
                                <Input
                                    type="number"
                                    className="w-20 h-8"
                                    value={p.quantity}
                                    onChange={(e) => updateQuantity(p.id, e.target.value)}
                                    min="1"
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeProduct(p.id)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {selectedProducts.length === 0 && (
                            <p className="text-sm text-muted-foreground">No products selected.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Reason / Description</Label>
                        <Textarea
                            placeholder={isAdd ? "e.g., New shipment, Restock..." : "e.g., Damaged goods, Internal use..."}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className={`w-full ${isAdd ? "bg-green-600 hover:bg-green-700" : "bg-destructive hover:bg-destructive/90"}`}
                        disabled={selectedProducts.length === 0}
                    >
                        Confirm {isAdd ? "Addition" : "Reduction"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default StockManagement;
