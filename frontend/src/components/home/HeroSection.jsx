import { Sparkles, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <div className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-hero">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="animate-slide-up">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-white text-sm font-medium">Stationery & Sports Collection</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Discover Your
                        <br />
                        <span className="text-white">Stationery & Sports</span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Explore our curated selection of the finest stationery and sports essentials for every need
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/products">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all px-8 py-6 text-lg">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Shop Now
                            </Button>
                        </Link>
                        <Link to="/products?category=Featured">
                            <Button size="lg" variant="outline" className="border-2 border-white text-gray hover:bg-white/10 px-8 py-6 text-lg backdrop-blur-sm">
                                <Star className="w-5 h-5 mr-2 " />
                                Featured Products
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto animate-fade-in">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">500+</div>
                        <div className="text-white/80">Quality Products</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">10k+</div>
                        <div className="text-white/80">Happy Customers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">24/7</div>
                        <div className="text-white/80">Fast Delivery</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
