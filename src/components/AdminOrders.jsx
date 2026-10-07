import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, PackageCheck } from "lucide-react";
import api from "@/api/axios";
import "@/utils/AdminOrders.css";

const ORDER_STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];
const formatPrice = (amount) => `INR ${Number(amount || 0).toLocaleString("en-IN")}`;
const formatDate = (value) =>
  value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "-";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/v1/orders/admin");
      setOrders(response.data.orders || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const customer = order.user || {};
      const haystack = [
        order.orderNumber,
        customer.firstName,
        customer.lastName,
        customer.email,
      ].join(" ").toLowerCase();
      return (!query || haystack.includes(query)) &&
        (statusFilter === "all" || order.status === statusFilter);
    });
  }, [orders, search, statusFilter]);

  const updateStatus = async (orderId, status) => {
    setBusyOrderId(orderId);
    setError("");
    try {
      const response = await api.patch(`/api/v1/orders/admin/${orderId}/status`, { status });
      setOrders((current) => current.map((order) =>
        order._id === orderId ? response.data.order : order
      ));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update this order.");
    } finally {
      setBusyOrderId("");
    }
  };

  const counts = {
    total: orders.length,
    active: orders.filter((order) => ["placed", "processing", "shipped"].includes(order.status)).length,
    delivered: orders.filter((order) => order.status === "delivered").length,
  };

  return (
    <main className="admin-orders">
      <header className="admin-orders__header">
        <div>
          <p className="admin-orders__eyebrow">Store management</p>
          <h1>Orders</h1>
          <p>Review demo orders, customer details, and fulfillment status.</p>
        </div>
        <button className="admin-orders__refresh" type="button" onClick={loadOrders} disabled={loading}>
          <RefreshCw size={16} aria-hidden="true" /> Refresh
        </button>
      </header>

      <section className="admin-orders__stats" aria-label="Order summary">
        <div><span>Total orders</span><strong>{counts.total}</strong></div>
        <div><span>In progress</span><strong>{counts.active}</strong></div>
        <div><span>Delivered</span><strong>{counts.delivered}</strong></div>
      </section>

      <section className="admin-orders__panel">
        <div className="admin-orders__toolbar">
          <label className="admin-orders__search">
            <Search size={17} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order or customer" />
          </label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by order status">
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        {error && <p className="admin-orders__error" role="alert">{error}</p>}
        {loading ? (
          <p className="admin-orders__empty">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-orders__empty">
            <PackageCheck aria-hidden="true" />
            <strong>No orders found</strong>
            <span>Orders placed through the demo checkout will appear here.</span>
          </div>
        ) : (
          <div className="admin-orders__list">
            {filteredOrders.map((order) => (
              <article className="admin-order" key={order._id}>
                <div className="admin-order__top">
                  <div>
                    <strong>{order.orderNumber}</strong>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <label className="admin-order__status">
                    <span className="admin-orders__visually-hidden">Update order status</span>
                    <select
                      value={order.status}
                      disabled={busyOrderId === order._id}
                      onChange={(event) => updateStatus(order._id, event.target.value)}
                    >
                      {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </label>
                </div>

                <div className="admin-order__customer">
                  <strong>{[order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") || order.shippingAddress?.name || "Deleted account"}</strong>
                  <span>{order.user?.email || order.shippingAddress?.email || "No email"}</span>
                  <span>{order.shippingAddress?.phoneNo || order.user?.phoneNo || "No phone"}</span>
                </div>

                <div className="admin-order__items">
                  {order.items.map((item, index) => (
                    <div key={item._id || `${item.productId || "item"}-${index}`}>
                      <span>{item.productName} x {item.quantity}</span>
                      <strong>{formatPrice(item.lineTotal)}</strong>
                    </div>
                  ))}
                </div>

                <div className="admin-order__bottom">
                  <span>{order.paymentMethod} ? Simulated payment</span>
                  <strong>{formatPrice(order.total)}</strong>
                </div>

                <div className="admin-order__address">
                  {[order.shippingAddress?.address, order.shippingAddress?.city, order.shippingAddress?.zipCode].filter(Boolean).join(", ") || "No delivery address saved"}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
