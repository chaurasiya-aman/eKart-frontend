import { useEffect, useState } from "react";
import { PackageCheck } from "lucide-react";
import api from "@/api/axios";
import "@/utils/MyOrders.css";

const formatPrice = (amount) => `INR ${Number(amount || 0).toLocaleString("en-IN")}`;
const formatDate = (value) =>
  value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "-";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/v1/orders/mine")
      .then((response) => setOrders(response.data.orders || []))
      .catch((requestError) => setError(requestError.response?.data?.message || "Could not load your orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="my-orders">
      <header className="my-orders__header">
        <p className="my-orders__eyebrow">Your account</p>
        <h1>My orders</h1>
        <p>Check the status and details of your orders.</p>
      </header>
      {error && <p className="my-orders__error" role="alert">{error}</p>}
      {loading ? (
        <p className="my-orders__empty">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <section className="my-orders__empty">
          <PackageCheck aria-hidden="true" />
          <strong>No orders yet</strong>
          <span>Your placed orders will appear here.</span>
        </section>
      ) : (
        <div className="my-orders__list">
          {orders.map((order) => (
            <article className="my-order" key={order._id}>
              <header>
                <div><strong>{order.orderNumber}</strong><span>{formatDate(order.createdAt)}</span></div>
                <span className={`my-order__status my-order__status--${order.status}`}>{order.status}</span>
              </header>
              <div className="my-order__items">
                {order.items.map((item, index) => (
                  <div key={item._id || `${item.productId || "item"}-${index}`}>
                    <span>{item.productName} x {item.quantity}</span>
                    <strong>{formatPrice(item.lineTotal)}</strong>
                  </div>
                ))}
              </div>
              <footer>
                <span>{order.paymentMethod} ? Demo</span>
                <strong>{formatPrice(order.total)}</strong>
              </footer>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
