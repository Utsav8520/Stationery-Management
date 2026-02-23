import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const orderId = queryParams.get("orderId");
  const message = queryParams.get("message");
  const { clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [hasClearedCart, setHasClearedCart] = useState(false); // New state to track if cart has been cleared

  useEffect(() => {
    let isMounted = true;

    const handleClearCart = async () => {
      // Clear cart only if payment was successful AND user is logged in AND auth is not loading AND cart hasn't been cleared yet
      if (status === "SUCCESS" && !authLoading && user && !hasClearedCart && isMounted) {
        try {
          await clearCart();
          setHasClearedCart(true); // Mark cart as cleared
          console.log("Cart cleared successfully after order confirmation.");
        } catch (error) {
          console.error("Failed to clear cart:", error.message);
        }
      }
    };

    handleClearCart();

    return () => {
      isMounted = false;
    };
  }, [status, authLoading, user, clearCart, hasClearedCart]); // Add hasClearedCart to dependency array

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {status === "SUCCESS" ? (
          <div className="text-center">
            <CheckCircle2 className="text-green-500 h-24 w-24 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your order (ID: {orderId}) has been placed and payment confirmed.
            </p>
            <Link to={`/orders/${orderId}`}>
              <Button size="lg" className="mr-4">View Order</Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <XCircle className="text-red-500 h-24 w-24 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Payment Failed!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              There was an issue processing your payment. {message && `Reason: ${message}`}
            </p>
            <Link to="/checkout">
              <Button size="lg" className="mr-4">Try Again</Button>
            </Link>
            <Link to="/cart">
              <Button size="lg" variant="outline">Back to Cart</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderConfirmationPage;
