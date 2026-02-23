import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/Home";
import ProductsPage from "@/pages/Products";
import ProductDetailPage from "@/pages/ProductDetail";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import ProfilePage from "@/pages/Profile";
import OrdersPage from "@/pages/Orders";
import OrderDetailPage from "@/pages/OrderDetail";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboardPage from "@/pages/admin/Dashboard";
import AdminProductsPage from "@/pages/admin/Products";
import AdminProductCreatePage from "@/pages/admin/ProductCreate";
import AdminProductEditPage from "@/pages/admin/ProductEdit";
import AdminOrdersPage from "@/pages/admin/Orders";
import AdminOrderDetailPage from "@/pages/admin/OrderDetail";
import AdminRidersPage from "@/pages/admin/Riders";
import AdminRiderCreatePage from "@/pages/admin/RiderCreate";
import AdminRiderEditPage from "@/pages/admin/RiderEdit";
import AdminAnalyticsPage from "@/pages/admin/Analytics";
import AdminCreditPartiesPage from "@/pages/admin/CreditParties";
import AdminCreditPartyCreatePage from "@/pages/admin/CreditPartyCreate";
import AdminCreditPartyEditPage from "@/pages/admin/CreditPartyEdit";
import AdminCreditTransactionsPage from "@/pages/admin/CreditTransactions"; // Add this import
import AdminDeliveriesPage from "@/pages/admin/Deliveries";
import AdminUsersPage from "@/pages/admin/Users";
import AdminUserEditPage from "@/pages/admin/UserEdit";
import AdminStockManagementPage from "@/pages/admin/StockManagement";
import OrderConfirmationPage from "@/pages/OrderConfirmation"; // New Import

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/payment-status" element={<OrderConfirmationPage />} /> {/* New route */}


            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/products/new" element={<AdminProductCreatePage />} />
                <Route path="/admin/products/edit/:id" element={<AdminProductEditPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
                <Route path="/admin/riders" element={<AdminRidersPage />} />
                <Route path="/admin/riders/new" element={<AdminRiderCreatePage />} />
                <Route path="/admin/riders/edit/:id" element={<AdminRiderEditPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                <Route path="/admin/deliveries" element={<AdminDeliveriesPage />} />
                <Route path="/admin/credits" element={<AdminCreditPartiesPage />} />
                <Route path="/admin/credits/parties" element={<AdminCreditPartiesPage />} />
                <Route path="/admin/credits/parties/new" element={<AdminCreditPartyCreatePage />} />
                <Route path="/admin/credits/parties/edit/:id" element={<AdminCreditPartyEditPage />} />
                <Route path="/admin/credits/parties/:id/transactions" element={<AdminCreditTransactionsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/users/edit/:id" element={<AdminUserEditPage />} />
                <Route path="/admin/stock" element={<AdminStockManagementPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
