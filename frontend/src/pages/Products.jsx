import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import api from "@/lib/api";
import ProductCard from "@/components/global/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

const categories = ["All", "Stationery", "Sports", "Office Supplies", "School Supplies"];
const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
];

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
    const [sortBy, setSortBy] = useState("name-asc");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        if (category) setSelectedCategory(category);
        if (search) setSearchQuery(search);
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortBy, searchQuery]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = "/products?";
            if (selectedCategory && selectedCategory !== "All") {
                url += `category=${selectedCategory}&`;
            }
            if (searchQuery) {
                url += `search=${encodeURIComponent(searchQuery)}&`;
            }

            const data = await api.get(url);
            let fetchedProducts = data.products || [];

            // Client-side sorting
            const [field, order] = sortBy.split("-");
            fetchedProducts.sort((a, b) => {
                if (field === "name") {
                    return order === "asc"
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                } else if (field === "price") {
                    return order === "asc"
                        ? a.price - b.price
                        : b.price - a.price;
                }
                return 0;
            });

            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === "All") {
            searchParams.delete("category");
        } else {
            searchParams.set("category", category);
        }
        setSearchParams(searchParams);
    };

    const clearFilters = () => {
        setSelectedCategory("All");
        setSearchQuery("");
        setSortBy("name-asc");
        setSearchParams({});
    };

    const hasActiveFilters = selectedCategory !== "All" || searchQuery;

    return (
        <MainLayout>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Products</h1>
                    <p className="text-lg text-muted-foreground">
                        Premium Stationery and Sports Collection
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Everything you need for school, office and play.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => handleCategoryChange(category)}
                                className={selectedCategory === category ? "bg-gradient-primary" : ""}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Sort and Clear */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-muted-foreground" />
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {hasActiveFilters && (
                            <Button variant="outline" onClick={clearFilters} className="gap-2">
                                <X className="w-4 h-4" />
                                Clear Filters
                            </Button>
                        )}
                    </div>

                    {/* Active Search Query Display */}
                    {searchQuery && (
                        <div className="bg-muted px-4 py-3 rounded-lg">
                            <p className="text-sm">
                                Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
                            <Filter className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No products found</h3>
                        <p className="text-muted-foreground mb-6">
                            Try adjusting your filters or search query
                        </p>
                        <Button onClick={clearFilters}>Clear All Filters</Button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ProductsPage;
