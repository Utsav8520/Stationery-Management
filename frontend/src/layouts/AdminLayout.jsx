import { NavLink, useNavigate } from "react-router-dom";
import {
    Package,
    ShoppingCart,
    Users,
    LineChart,
    CreditCard,
    Truck,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { name: "Products", icon: Package, path: "/admin/products" },
        { name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
        { name: "Stock", icon: Package, path: "/admin/stock" },
        { name: "Deliveries", icon: Truck, path: "/admin/deliveries" },
        { name: "Riders", icon: Users, path: "/admin/riders" },
        { name: "Users", icon: Users, path: "/admin/users" },
        { name: "Credits", icon: CreditCard, path: "/admin/credits" },

    ];

    const baseLinkClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
    const activeLinkClasses = "bg-primary text-white font-semibold shadow-lg";
    const inactiveLinkClasses = "hover:bg-primary/10 hover:text-primary";

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/50 z-30 lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-card border-r z-40 transform transition-transform
                           ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                           lg:translate-x-0 lg:fixed`}
            >
                <div className="p-4 h-full flex flex-col">
                    <div className="text-2xl font-bold mb-8 text-center text-primary">
                        Admin Panel
                    </div>
                    <nav className="flex-grow">
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        end={item.path === "/admin"}
                                        className={({ isActive }) =>
                                            `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                                        }
                                        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </NavLink>
                                    
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="mt-auto">
                        <Button
                            onClick={handleLogout}
                            variant="destructive"
                            className="w-full justify-start gap-3"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-background text-foreground">
            <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="lg:ml-64 transition-all duration-300">
                <header className="lg:hidden sticky top-0 bg-card/80 backdrop-blur-sm border-b p-4 flex items-center justify-between z-20">
                    <div className="text-xl font-bold text-primary">Admin</div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </Button>
                </header>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};


export default AdminLayout;
