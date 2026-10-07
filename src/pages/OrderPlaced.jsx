import { Link, useLocation } from "react-router-dom";
import { Check, PackageCheck, ShoppingBag } from "lucide-react";
import "@/utils/OrderPlaced.css";

const formatPrice = (amount) =>
  `INR ${Number(amount || 0).toLocaleString("en-IN")}`;

export default function OrderPlaced() {
  const { state } = useLocation();

  if (!state?.isDemo) {
    return (
      <main className="order-placed-page">
        <section className="order-placed-card order-placed-card--missing">
          <PackageCheck aria-hidden="true" />
          <h1>No demo order to display</h1>
          <p>Place a demo order from checkout to see the confirmation animation.</p>
          <Link className="order-placed-primary" to="/products">Browse products</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="order-placed-page">
      <section className="order-placed-card" aria-labelledby="order-placed-title">
        <div className="order-placed-animation" aria-hidden="true">
          <span className="order-placed-ring" />
          <span className="order-placed-icon"><Check /></span>
          <span className="order-placed-spark order-placed-spark--one" />
          <span className="order-placed-spark order-placed-spark--two" />
          <span className="order-placed-spark order-placed-spark--three" />
        </div>

        <p className="order-placed-eyebrow">Academic project demo</p>
        <h1 id="order-placed-title">Order placed!</h1>
        <p className="order-placed-message">
          Your demo order has been recorded for store tracking. No real payment was made.
        </p>

        <div className="order-placed-reference">
          <span>Demo reference</span>
          <strong>{state.reference}</strong>
        </div>

        <div className="order-placed-details">
          <div><span>Payment option</span><strong>{state.paymentMethod}</strong></div>
          <div><span>Items</span><strong>{state.itemCount}</strong></div>
          <div><span>Demo total</span><strong>{formatPrice(state.total)}</strong></div>
        </div>

        <div className="order-placed-notice" role="note">
          Academic demo only: no money was charged. Your cart is now empty.
        </div>

        <Link className="order-placed-primary" to="/products">
          <ShoppingBag aria-hidden="true" /> Continue shopping
        </Link>
        <Link className="order-placed-secondary" to="/">Back to home</Link>
      </section>
    </main>
  );
}
