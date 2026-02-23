import AdminLayout from "@/layouts/AdminLayout";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const AdminAnalyticsPage = () => {
  const [salesAnalytics, setSalesAnalytics] = useState(null);
  const [stockAnalytics, setStockAnalytics] = useState(null);
  const [orderAnalytics, setOrderAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const sales = await api.get("/admin/analytics/sales");
      setSalesAnalytics(sales);

      const stock = await api.get("/admin/analytics/stock");
      setStockAnalytics(stock);

      const orders = await api.get("/admin/analytics/orders");
      setOrderAnalytics(orders);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading analytics...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Sales Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Sales Analytics</h2>
          {salesAnalytics ? (
            <div>
              <p>
                <strong>Total Sales:</strong> Rs. {salesAnalytics.totalSales ? salesAnalytics.totalSales.toFixed(2) : '0.00'}
              </p>
              <p>
                <strong>Number of Orders:</strong> {salesAnalytics.numberOfOrders || 0}
              </p>
            </div>
          ) : (
            <p>No sales data available.</p>
          )}
        </div>

        {/* Stock Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Low Stock Products</h2>
          {stockAnalytics && stockAnalytics.lowStockProducts && stockAnalytics.lowStockProducts.length > 0 ? (
            <ul>
              {stockAnalytics.lowStockProducts.map((product) => (
                <li key={product.id}>
                  {product.name} (Stock: {product.stock})
                </li>
              ))}
            </ul>
          ) : (
            <p>No low stock products.</p>
          )}
        </div>

        {/* Order Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Order Status Overview</h2>
          {orderAnalytics && orderAnalytics.orderStatusCounts ? (
            <ul>
              {Object.entries(orderAnalytics.orderStatusCounts).map(
                ([status, count]) => (
                  <li key={status}>
                    <strong>{status}:</strong> {count}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>No order status data available.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
