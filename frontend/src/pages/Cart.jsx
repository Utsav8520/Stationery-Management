import { useCart } from "@/contexts/CartContext";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CartPage = () => {
  const { cart, loading, updateCartItem, removeCartItem, clearCart } =
    useCart();

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <p>Loading cart...</p>
        </div>
      </MainLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <p className="mb-4">Your cart is empty.</p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    try {
      await updateCartItem(productId, quantity);
    } catch (error) {
      // Consider using a toast notification for better UX
      alert("Failed to update item quantity.");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(productId);
    } catch (error) {
      alert("Failed to remove item from cart.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      alert("Failed to clear cart.");
    }
  };

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="hidden md:grid md:grid-cols-5 gap-4 items-center font-semibold border-b p-4">
                    <div className="col-span-2">Product</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div className="text-right">Total</div>
                  </div>
                  {cart.items.map((item) => (
                    <div
                      key={item.productId}
                      className="grid grid-cols-3 md:grid-cols-5 gap-4 items-center p-4 border-b last:border-b-0"
                    >
                      {/* Product */}
                      <div className="col-span-3 md:col-span-2 flex items-center gap-4">
                        <img
                          src={
                            item.product.imageUrl
                              ? `${import.meta.env.VITE_BACKEND_URL}${item.product.imageUrl
                              }`
                              : "/placeholder.svg"
                          }
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                          <Link
                            to={`/products/${item.productId}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.product.category}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="hidden md:block">
                        Rs. {item.product.price.toFixed(2)}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.productId,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-14 h-8 text-center mx-2"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </Button>
                      </div>

                      {/* Total */}
                      <div className="font-semibold text-right">
                        <span>
                          Rs. {(item.quantity * item.product.price).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs. {totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Link to="/checkout" className="w-full">
                  <Button className="w-full">Proceed to Checkout</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;