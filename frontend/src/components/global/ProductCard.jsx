
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Eye, Package } from "lucide-react";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const handleAddToCart = async () => {
        if (!user) {
            const returnUrl = `/products/${product.id}`;
            navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
            toast.info("Please log in to add items to cart");
            return;
        }
        try {
            await addToCart(product.id);
            toast.success("Product added to cart!");
        } catch (error) {
            toast.error(error.message || "Failed to add product to cart");
        }
    };

    const imageUrl = product.imageUrl
        ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${import.meta.env.VITE_BACKEND_URL}${product.imageUrl}`)
        : "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop";

    const isLowStock = product.stock > 0 && product.stock <= 10;
    const isOutOfStock = product.stock === 0;

    return (
        <Card className="group hover-lift overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all">
            <CardHeader className="p-0 relative overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop";
                        }}
                    />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.category && (
                        <span className="bg-gradient-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            {product.category}
                        </span>
                    )}
                    {isOutOfStock && (
                        <span className="bg-destructive text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            Out of Stock
                        </span>
                    )}
                    {isLowStock && (
                        <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            Low Stock
                        </span>
                    )}
                </div>

                {/* Quick View Button */}
                <Link
                    to={`/products/${product.id}`}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                    <Button size="sm" variant="secondary" className="shadow-lg">
                        <Eye className="w-4 h-4 mr-2" />
                        Quick View
                    </Button>
                </Link>
            </CardHeader>

            <CardContent className="p-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {product.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-gradient-primary">
                            Rs. {product.price.toLocaleString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Package className="w-4 h-4" />
                        <span>{product.stock} in stock</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
                <Link to={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                        View Details
                    </Button>
                </Link>
                <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
