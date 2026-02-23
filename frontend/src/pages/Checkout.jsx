import MainLayout from "@/layouts/MainLayout";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

const CheckoutPage = () => {
    const { cart, loading, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState("");

    useEffect(() => {
        if (user?.address) {
            setDeliveryAddress(user.address);
        }
    }, [user]);

    if (loading) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8">
                    <p>Loading cart...</p>
                </div>
            </MainLayout>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                    <p>Your cart is empty. Please add items to proceed to checkout.</p>
                    <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
                </div>
            </MainLayout>
        );
    }

    const subtotal = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
    );
    const shipping = 0; // Or calculate based on logic
    const totalAmount = subtotal + shipping;


    const handlePlaceOrder = async () => {
        if (!deliveryAddress || deliveryAddress.trim() === "") {
            setCheckoutError("Please enter a delivery address.");
            return;
        }

        setIsProcessingOrder(true);
        setCheckoutError(null);
        try {
            const orderItems = cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            if (orderItems.length === 0) {
                throw new Error("Your cart is empty. Cannot place an order.");
            }

            const orderResponse = await api.post("/orders", { items: orderItems, deliveryAddress: deliveryAddress });
            const orderId = orderResponse.id;
            if (!orderId) {
                throw new Error(orderResponse.message || "Failed to create order.");
            }

            const paymentResponse = await api.post("/payments/khalti/initiate", {
                orderId: orderId,
                amount: totalAmount * 100,
            });

            if (paymentResponse.payment_url) {
                window.location.href = paymentResponse.payment_url;
            } else {
                throw new Error(paymentResponse.message || "Failed to initiate payment.");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            setCheckoutError(error.message || "An error occurred during checkout.");
        } finally {
            setIsProcessingOrder(false);
        }
    };


    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="border-2 border-primary/20 shadow-lg">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-2xl">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item.productId} className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={
                                                    item.product.imageUrl
                                                        ? `${import.meta.env.VITE_BACKEND_URL}${item.product.imageUrl}`
                                                        : "/placeholder.svg"
                                                }
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div>
                                                <p className="font-semibold">{item.product.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">
                                            Rs. {(item.quantity * item.product.price).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Subtotal</p>
                                        <p>Rs. {subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Shipping</p>
                                        <p>{shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`}</p>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <p>Total</p>
                                        <p>Rs. {totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label>Name</Label>
                                        <p className="text-sm text-muted-foreground">{user?.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Email</Label>
                                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Delivery Address</Label>
                                        <Textarea
                                            id="address"
                                            placeholder="Enter your delivery address..."
                                            value={deliveryAddress}
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                            rows={3}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            This address will be used for this order only.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <img src="https://blog.khalti.com/wp-content/uploads/2021/01/khalti-icon.png" alt="Khalti" className="w-10 h-10" />
                                    <div>
                                        <p className="font-semibold">Khalti Digital Wallet</p>
                                        <p className="text-sm text-muted-foreground">
                                            You will be redirected to Khalti to complete your payment.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {checkoutError && (
                            <Alert variant="destructive">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {checkoutError}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            size="lg"
                            className="w-full bg-gradient-primary"
                            onClick={handlePlaceOrder}
                            disabled={isProcessingOrder}
                        >
                            {isProcessingOrder ? "Processing..." : `Pay Rs. ${totalAmount.toFixed(2)} with Khalti`}
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CheckoutPage;
