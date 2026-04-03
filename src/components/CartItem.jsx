import { useState } from "react";

export default function CartItem({ styles, item , setItems, fmt }) {
  const [removing, setRemoving] = useState(null);

  const changeQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item, 
      ),
    );
  };

  const removeItem = (id) => {
    setRemoving(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setRemoving(null);
    }, 200);
  };
  return (
    <div
      style={{
        ...styles.cartItem,
        opacity: removing === item.id ? 0 : 1,
        transform: removing === item.id ? "translateX(12px)" : "none",
        transition: "opacity 0.2s, transform 0.2s",
      }}
    >
      <img
        src={item.image}
        alt={item.name}
        style={styles.itemImg}
        onError={(e) => (e.target.style.background = "#f0f0f0")}
      />
      <div style={styles.itemInfo}>
        <div style={styles.itemName}>{item.name}</div>
        <div style={styles.itemPrice}>{fmt(item.price)} each</div>
        <div style={styles.itemTag}>{item.tag}</div>
      </div>
      <div style={styles.itemRight}>
        <div style={styles.itemTotal}>{fmt(item.price * item.quantity)}</div>
        <div style={styles.qtyCtrl}>
          <button style={styles.qtyBtn} onClick={() => changeQty(item.id, -1)}>
            −
          </button>
          <div style={styles.qtyNum}>{item.quantity}</div>
          <button style={styles.qtyBtn} onClick={() => changeQty(item.id, 1)}>
            +
          </button>
        </div>
        <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>
          Remove
        </button>
      </div>
    </div>
  );
}

