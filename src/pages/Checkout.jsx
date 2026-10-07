import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  Landmark,
  LockKeyhole,
  MapPin,
  Smartphone,
} from "lucide-react";
import api from "@/api/axios";
import "@/utils/Checkout.css";

const paymentMethods = [
  { id: "upi", label: "UPI", detail: "Apps and UPI ID", Icon: Smartphone },
  { id: "card", label: "Credit or debit card", detail: "Visa, Mastercard and more", Icon: CreditCard },
  { id: "netbanking", label: "Net banking", detail: "All major banks", Icon: Landmark },
  { id: "cod", label: "Cash on delivery", detail: "Pay when your order arrives", Icon: Banknote },
];

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function Checkout() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);

  useEffect(() => {
    if (!user?._id) {
      navigate("/login", { replace: true });
      return;
    }

    let isMounted = true;

    const loadCheckout = async () => {
      try {
        const [cartResponse, profileResponse] = await Promise.all([
          api.get("/api/v1/cart"),
          api.get(`/api/v1/user/get-user/${user._id}`),
        ]);

        if (!isMounted) return;
        const cartItems = cartResponse.data.cart?.items || [];
        setItems(cartItems.filter((item) => item?.productId));
        setProfile(profileResponse.data.user || user);
      } catch {
        if (isMounted) setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCheckout();
    return () => {
      isMounted = false;
    };
  }, [navigate, user]);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + Number(item.productId?.productPrice || 0) * Number(item.quantity || 0),
      0,
    );
    const tax = Math.round(subtotal * 0.18);
    return { subtotal, tax, total: subtotal + tax };
  }, [items]);

  const selectedPayment = paymentMethods.find((method) => method.id === paymentMethod);

  const handleDemoPayment = async () => {
    if (isProcessingDemo) return;
    setIsProcessingDemo(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      const response = await api.post("/api/v1/orders/demo", {
        paymentMethod: selectedPayment?.label || "UPI",
      });
      const order = response.data.order;
      navigate("/order-placed", {
        state: {
          isDemo: true,
          reference: order.orderNumber,
          paymentMethod: order.paymentMethod,
          total: order.total,
          itemCount: order.items.reduce((count, item) => count + Number(item.quantity || 0), 0),
        },
      });
    } catch {
      setIsProcessingDemo(false);
    }
  };
  const deliveryAddress = [profile?.address, profile?.city, profile?.zipCode]
    .filter(Boolean)
    .join(", ");

  if (!user?._id) return null;

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="checkout-loading" aria-live="polite">Preparing your checkout…</div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add a product before continuing to checkout.</p>
          <Link to="/products" className="checkout-primary-link">Browse products</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <Link to="/cart" className="checkout-back-link">
            <ArrowLeft aria-hidden="true" />
            Back to cart
          </Link>
          <p className="checkout-eyebrow">Secure checkout</p>
          <h1>Review and pay</h1>
          <p>Choose how you would like to pay for your order.</p>
        </header>

        <div className="checkout-grid">
          <div className="checkout-main-column">
            <section className="checkout-panel" aria-labelledby="delivery-title">
              <div className="checkout-panel-heading">
                <span className="checkout-step">1</span>
                <div>
                  <h2 id="delivery-title">Delivery address</h2>
                  <p>Where should we send your order?</p>
                </div>
              </div>
              <div className="checkout-address">
                <MapPin aria-hidden="true" />
                <div className="checkout-address__details">
                  <strong>{[profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Your account"}</strong>
                  <span>{profile?.email || user.email}</span>
                  {profile?.phoneNo && <span>{profile.phoneNo}</span>}
                  <span>
                    {deliveryAddress || "No saved address yet. Add your address in your profile."}
                  </span>
                </div>
                <Link to="/profile" className="checkout-edit-link">Edit</Link>
              </div>
            </section>

            <section className="checkout-panel" aria-labelledby="payment-title">
              <div className="checkout-panel-heading">
                <span className="checkout-step">2</span>
                <div>
                  <h2 id="payment-title">Payment method</h2>
                  <p>Select a payment option</p>
                </div>
              </div>

              <fieldset className="checkout-methods">
                <legend className="checkout-visually-hidden">Choose a payment method</legend>
                {paymentMethods.map(({ id, label, detail, Icon }) => (
                  <label
                    key={id}
                    className={`checkout-method${paymentMethod === id ? " checkout-method--selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => {
                        setPaymentMethod(id);
                      }}
                    />
                    <span className="checkout-method__icon"><Icon aria-hidden="true" /></span>
                    <span className="checkout-method__copy">
                      <strong>{label}</strong>
                      <small>{detail}</small>
                    </span>
                    <span className="checkout-method__check" aria-hidden="true">
                      {paymentMethod === id && <Check />}
                    </span>
                  </label>
                ))}
              </fieldset>

              <div className="checkout-payment-note" aria-live="polite">
                <LockKeyhole aria-hidden="true" />
                <p>
                  <strong>{selectedPayment?.label} selected.</strong>{" "}
                  Academic demo only. Continue will simulate a result; no payment details are collected.
                </p>
              </div>
            </section>
          </div>

          <aside className="checkout-summary" aria-labelledby="summary-title">
            <h2 id="summary-title">Order summary</h2>
            <div className="checkout-items">
              {items.map((item) => (
                <div className="checkout-item" key={item._id}>
                  <div className="checkout-item__image-wrap">
                    {item.productId.productImage?.[0]?.url ? (
                      <img src={item.productId.productImage[0].url} alt="" />
                    ) : (
                      <CreditCard aria-hidden="true" />
                    )}
                    <span>{item.quantity}</span>
                  </div>
                  <div className="checkout-item__copy">
                    <strong>{item.productId.productName}</strong>
                    <small>{item.productId.brand || item.productId.category}</small>
                  </div>
                  <span className="checkout-item__price">
                    {formatPrice(Number(item.productId.productPrice || 0) * Number(item.quantity || 0))}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-total-row">
              <span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="checkout-total-row">
              <span>Delivery</span><span className="checkout-free">Free</span>
            </div>
            <div className="checkout-total-row">
              <span>GST (18%)</span><span>{formatPrice(totals.tax)}</span>
            </div>
            <div className="checkout-grand-total">
              <strong>Total</strong><strong>{formatPrice(totals.total)}</strong>
            </div>

            <button
              type="button"
              className="checkout-continue-button"
              onClick={handleDemoPayment}
              disabled={isProcessingDemo}
            >
              {isProcessingDemo ? "Preparing your demo order..." : "Place demo order"}
            </button>
            <p className="checkout-disclaimer">
              <LockKeyhole aria-hidden="true" /> Academic project demo - no real payment
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
