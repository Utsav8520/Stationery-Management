import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/global/ProductCard";
import api from "@/lib/api";

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const data = await api.get("/products?featured=true&limit=8");
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const itemsPerPage = typeof window !== 'undefined' && window.innerWidth < 640 ? 1 :
        typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : 4;

    const maxIndex = Math.max(0, products.length - itemsPerPage);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    if (loading) {
        return (
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-slide-up">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">Featured Products</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Hand-picked premium selections from our exclusive collection
                    </p>
                </div>

                <div className="relative">
                    {/* Carousel */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out gap-6"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                        >
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex-shrink-0 animate-scale-in"
                                    style={{ width: `calc(${100 / itemsPerPage}% - ${(itemsPerPage - 1) * 24 / itemsPerPage}px)` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {products.length > itemsPerPage && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl z-10"
                                onClick={prevSlide}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl z-10"
                                onClick={nextSlide}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Dots Indicator */}
                {products.length > itemsPerPage && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                                    }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
