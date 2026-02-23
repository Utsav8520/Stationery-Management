import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu, X, User, LogOut, LayoutDashboard, Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
            setMobileMenuOpen(false);
        }
    };

    const cartItemCount = cart?.items?.length || 0;

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-primary hidden sm:inline">
                            Ambey Enterprises
                        </span>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-muted/50 border-0 focus:bg-muted"
                            />
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/products">
                            <Button variant="ghost" className="hover:bg-primary/10">
                                Products
                            </Button>
                        </Link>

                        <Link to="/cart" className="relative">
                            <Button variant="ghost" className="hover:bg-primary/10">
                                <ShoppingCart className="h-5 w-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold animate-scale-in">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {user ? (
                            <>
                                {user.role === "ADMIN" && (
                                    <Link to="/admin">
                                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                            Admin Dashboard
                                        </Button>
                                    </Link>
                                )}
                                <Link to="/profile">
                                    <Button variant="ghost" className="hover:bg-primary/10">
                                        <User className="w-4 h-4 mr-2" />
                                        Profile
                                    </Button>
                                </Link>
                                <Button onClick={logout} variant="outline" className="hover:bg-destructive hover:text-white hover:border-destructive">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button className="bg-gradient-primary hover:opacity-90">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="outline">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border animate-slide-up">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </form>

                        <div className="flex flex-col gap-2">
                            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                    Products
                                </Button>
                            </Link>

                            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Cart {cartItemCount > 0 && `(${cartItemCount})`}
                                </Button>
                            </Link>

                            {user ? (
                                <>
                                    {user.role === "ADMIN" && (
                                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full justify-start border-primary text-primary">
                                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                                Admin Dashboard
                                            </Button>
                                        </Link>
                                    )}
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <User className="w-4 h-4 mr-2" />
                                            Profile
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full bg-gradient-primary">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
