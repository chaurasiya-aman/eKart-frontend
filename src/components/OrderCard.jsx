import { ShieldCheck, Tag } from "lucide-react";

export default function OrderCard({ fmt, items }) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.productId.productPrice * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <div className="order-summary-card">
      <div className="order-summary-title">Order Summary</div>

      <div className="order-summary-row">
        <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
        <span className="font-semibold text-gray-800">{fmt(subtotal)}</span>
      </div>

      <div className="order-summary-row">
        <span>Delivery</span>
        <span className="order-free-badge">FREE</span>
      </div>

      <div className="order-summary-row">
        <span>GST (18%)</span>
        <span className="font-semibold text-gray-800">{fmt(tax)}</span>
      </div>

      <div className="order-summary-row order-summary-total">
        <span>Total</span>
        <span>{fmt(total)}</span>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center gap-2">
        <Tag className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <p className="text-xs text-blue-600 font-medium">
          You save ₹{fmt(tax).replace("₹", "")} with free delivery!
        </p>
      </div>

      <button className="order-checkout-btn">
        Proceed to Checkout →
      </button>

      <div className="order-safe-note">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
        Secure checkout · 7-day easy returns
      </div>
    </div>
  );
}