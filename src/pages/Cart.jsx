import CartItem from "@/components/CartItem";
import { useState } from "react";

const initialItems = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 129999,
    quantity: 1,
    tag: "In stock",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484bce71?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    price: 74999,
    quantity: 2,
    tag: "2 left",
    image:
      "https://images.unsplash.com/photo-1678911820864-e3c1c5db2f62?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "iPhone 16 Pro",
    price: 129999,
    quantity: 1,
    tag: "In stock",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484bce71?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Samsung Galaxy S20",
    price: 74999,
    quantity: 2,
    tag: "2 left",
    image:
      "https://images.unsplash.com/photo-1678911820864-e3c1c5db2f62?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    name: "iPhone 16 Pro",
    price: 129999,
    quantity: 1,
    tag: "In stock",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484bce71?w=200&h=200&fit=crop",
  },
  {
    id: 6,
    name: "Samsung Galaxy S20",
    price: 74999,
    quantity: 2,
    tag: "2 left",
    image:
      "https://images.unsplash.com/photo-1678911820864-e3c1c5db2f62?w=200&h=200&fit=crop",
  },
];

function fmt(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function Cart() {
  const [items, setItems] = useState(initialItems);

  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0); // Total price of Cart Item
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax; // Total price with GST
  const count = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <div style={styles.wrap}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.h1}>Your Cart</h1>
        <p style={styles.subtext}>
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Savings Banner */}
      <div style={styles.savingsBanner}>
        <div style={styles.savingsDot} />
        You're getting free delivery on this order
      </div>

      <div style={styles.layout}>
        {/* Left: Items */}
        <div style={styles.itemsList}>
          {items.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🛒</div>
              Your cart is empty
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={items.id}
                styles={styles}
                item={item}
                setItems={setItems}
                fmt={fmt}
              />
            ))
          )}
        </div>

        {/* Right: Summary */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryTitle}>Order Summary</div>
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span style={styles.freeBadge}>Free</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tax (18% GST)</span>
            <span>{fmt(tax)}</span>
          </div>
          <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
          <button style={styles.checkoutBtn}>Proceed to Checkout</button>
          <div style={styles.safeNote}>Secure checkout · 7-day returns</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    fontFamily: "'DM Sans', sans-serif",
    padding: "2rem 1rem 3rem",
    maxWidth: 880,
    margin: "0 auto",
    marginTop: "25px",
  },

  header: { marginBottom: "1.5rem" },

  h1: {
    fontSize: "clamp(1.4rem, 2vw, 2rem)", 
    fontWeight: 400,
    fontFamily: "'DM Serif Display', Georgia, serif",
    letterSpacing: "-0.02em",
    margin: 0,
  },

  subtext: { fontSize: 13, color: "#888", marginTop: 4 },

  savingsBanner: {
    background: "#f5eedf",
    borderRadius: 10,
    padding: "10px 20px",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#8a6c3a",
    flexWrap: "wrap",
    position: "sticky",
  },

  savingsDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#c9a96e",
    flexShrink: 0,
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem",
    alignItems: "start",
  },

  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  cartItem: {
    background: "#fff",
    border: "0.5px solid #e0e0e0",
    borderRadius: 14,
    padding: "1rem",
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    flexWrap: "wrap",
  },

  itemImg: {
    width: "clamp(60px, 15vw, 72px)",
    height: "clamp(60px, 15vw, 72px)",
    borderRadius: 10,
    objectFit: "cover",
    flexShrink: 0,
    background: "#f5f5f5",
  },

  itemInfo: {
    flex: 1,
    minWidth: 0,
  },

  itemName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1a1a1a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  itemPrice: { fontSize: 13, color: "#888", marginTop: 3 },

  itemTag: {
    display: "inline-block",
    fontSize: 11,
    background: "#f5eedf",
    color: "#8a6c3a",
    borderRadius: 6,
    padding: "2px 8px",
    marginTop: 6,
    fontWeight: 500,
  },

  itemRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
    flexShrink: 0,
    width: "100%",
  },

  itemTotal: {
    fontSize: 15,
    fontWeight: 500,
    color: "#1a1a1a",
  },

  qtyCtrl: {
    display: "flex",
    alignItems: "center",
    border: "0.5px solid #e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },

  qtyBtn: {
    width: 30,
    height: 30,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyNum: {
    fontSize: 13,
    fontWeight: 500,
    width: 30,
    textAlign: "center",
    color: "#1a1a1a",
    borderLeft: "0.5px solid #e0e0e0",
    borderRight: "0.5px solid #e0e0e0",
    lineHeight: "30px",
  },

  removeBtn: {
    fontSize: 11,
    color: "#aaa",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 3,
    padding: 0,
  },

  summaryCard: {
    background: "#fff",
    border: "0.5px solid #e0e0e0",
    borderRadius: 14,
    padding: "1.25rem",
    position: "sticky",
    // top: "1rem",
    top: "80px",
    width: "100%",
  },

  summaryTitle: {
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontSize: "1.2rem",
    fontWeight: 400,
    color: "#1a1a1a",
    marginBottom: "1rem",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 13,
    color: "#888",
    padding: "6px 0",
  },

  summaryTotal: {
    fontSize: 15,
    fontWeight: 500,
    color: "#1a1a1a",
    borderTop: "0.5px solid #e0e0e0",
    marginTop: 6,
    paddingTop: 14,
  },

  freeBadge: {
    fontSize: 11,
    background: "#eaf3de",
    color: "#3b6d11",
    borderRadius: 6,
    padding: "2px 8px",
    fontWeight: 500,
  },

  checkoutBtn: {
    width: "100%",
    marginTop: "1.25rem",
    padding: 13,
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    letterSpacing: "0.01em",
  },

  safeNote: {
    textAlign: "center",
    fontSize: 11,
    color: "#bbb",
    marginTop: 10,
  },
};
