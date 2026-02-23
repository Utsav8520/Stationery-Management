import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
    ShoppingCart,
    Package,
    Truck,
    Shield,
    Star,
    ChevronLeft,
    AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import ProductCard from "@/components/global/ProductCard";

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await api.get(`/products/${id}`);
            setProduct(data);

            // Fetch related products from same category
            if (data.category) {
                const relatedData = await api.get(`/products?category=${data.category}&limit=4`);
                const related = (relatedData.products || []).filter(p => p.id !== parseInt(id));
                setRelatedProducts(related.slice(0, 4));
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            // Redirect to login with return URL
            const returnUrl = `/products/${id}`;
            navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
            toast.info("Please log in to add items to cart");
            return;
        }

        try {
            await addToCart(product.id, quantity);
            toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`);
        } catch (error) {
            toast.error(error.message || "Failed to add to cart");
        }
    };

    const imageUrl = product?.imageUrl
        ? `${import.meta.env.VITE_BACKEND_URL}${product.imageUrl}`
        : "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop";

    const isLowStock = product && product.stock > 0 && product.stock <= 10;
    const isOutOfStock = product && product.stock === 0;

    if (loading) {
        return (
            <MainLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="aspect-square bg-muted animate-pulse rounded-lg"></div>
                        <div className="space-y-4">
                            <div className="h-12 bg-muted animate-pulse rounded"></div>
                            <div className="h-8 bg-muted animate-pulse rounded w-1/3"></div>
                            <div className="h-24 bg-muted animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!product) {
        return (
            <MainLayout>
                <div className="text-center py-16">
                    <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                    <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
                    <Link to="/products">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {/* Back Button */}
                <Link to="/products">
                    <Button variant="ghost" className="gap-2">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Products
                    </Button>
                </Link>

                {/* Product Details */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Image */}
                    <div className="space-y-4">
                        <div className="aspect-square overflow-hidden rounded-xl border-2 bg-muted">
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop";
                                }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        {product.category && (
                            <Badge className="bg-gradient-primary text-white">
                                {product.category}
                            </Badge>
                        )}

                        {/* Title */}
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                        </div>

                        {/* Price */}
                        <div>
                            <p className="text-4xl font-bold text-gradient-primary">
                                Rs. {product.price.toLocaleString()}
                            </p>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-muted-foreground" />
                            {isOutOfStock ? (
                                <span className="text-destructive font-semibold">Out of Stock</span>
                            ) : isLowStock ? (
                                <span className="text-amber-600 font-semibold">Only {product.stock} left in stock!</span>
                            ) : (
                                <span className="text-green-600 font-semibold">In Stock ({product.stock} available)</span>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div>
                                <h3 className="font-bold mb-2">Description</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        {!isOutOfStock && (
                            <div>
                                <label className="font-semibold mb-2 block">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </Button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="flex-1 bg-gradient-primary text-lg py-6"
                                size="lg"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {user ? "Add to Cart" : "Login to Add to Cart"}
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <Truck className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Fast Delivery</p>
                                    <p className="text-xs text-muted-foreground">2-3 business days</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Authentic Products</p>
                                    <p className="text-xs text-muted-foreground">100% genuine</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-3">Product Information</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Category</span>
                                        <span className="font-semibold">{product.category || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Stock Status</span>
                                        <span className="font-semibold">
                                            {isOutOfStock ? "Out of Stock" : "In Stock"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Product ID</span>
                                        <span className="font-semibold">#{product.id}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Availability</span>
                                        <span className="font-semibold">{product.stock} units</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-3">Shipping & Returns</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">✓</span>
                                        <span>Free shipping on orders over Rs. 5,000</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">✓</span>
                                        <span>Delivery within 2-3 business days in Kathmandu Valley</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">✓</span>
                                        <span>Easy returns within 7 days of purchase</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ProductDetailPage;
