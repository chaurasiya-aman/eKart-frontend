import api from "@/api/axios";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CartItem({ items, item, setItems, fmt }) {
  const [removing, setRemoving] = useState(null);
  const [loadingQty, setLoadingQty] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const changeQty = async (cartItemId, delta) => {
    const prevItems = [...items];
    const targetItem = items.find((i) => i._id === cartItemId);
    if (!targetItem) return;
    const type = delta === 1 ? "increase" : "decrease";
    try {
      setLoadingQty(cartItemId);
      setItems((prev) =>
        prev.map((i) =>
          i._id === cartItemId
            ? { ...i, quantity: Math.max(1, i.quantity + delta) }
            : i
        )
      );
      await api.put(
        `${API_URL}/api/v1/cart/update-qty`,
        { productId: targetItem.productId._id, type },
        { withCredentials: true }
      );
    } catch (error) {
      setItems(prevItems);
      toast.error(error?.response?.data?.message || "Failed to update quantity");
    } finally {
      setLoadingQty(null);
    }
  };

  const removeItem = async (productId) => {
    const prevItems = [...items];
    try {
      setRemoving(productId);
      setItems((prev) => prev.filter((i) => i.productId._id !== productId));
      await api.delete(`${API_URL}/api/v1/cart/${productId}`, {
        withCredentials: true,
      });
    } catch (err) {
      setItems(prevItems);
      toast.error(err?.response?.data?.message || "Failed to remove item");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div
      className="cart-item"
      style={{
        opacity: removing === item.productId._id ? 0.4 : 1,
        pointerEvents: removing === item.productId._id ? "none" : "auto",
      }}
    >
      <img
        src={item.productId?.productImage?.[0]?.url}
        alt={item.productId?.productName}
        className="cart-item-img"
        onError={(e) => (e.target.src = "/fallback.png")}
      />

      <div className="cart-item-info">
        <div className="cart-item-name">{item.productId?.productName}</div>
        <div className="cart-item-price">{fmt(item.productId?.productPrice)} each</div>
        <span className="cart-item-tag">{item.productId?.category}</span>
        <span className="cart-item-tag">{item.productId?.brand}</span>
      </div>

      <div className="cart-item-right">
        <div className="cart-item-total">{fmt(item.price * item.quantity)}</div>

        <div className="cart-qty-ctrl">
          <button
            className="cart-qty-btn"
            disabled={loadingQty === item._id}
            onClick={() => changeQty(item._id, -1)}
          >
            {loadingQty === item._id ? <Loader2 className="animate-spin w-3 h-3" /> : "−"}
          </button>
          <div className="cart-qty-num">{item.quantity}</div>
          <button
            className="cart-qty-btn"
            disabled={loadingQty === item._id}
            onClick={() => changeQty(item._id, 1)}
          >
            {loadingQty === item._id ? <Loader2 className="animate-spin w-3 h-3" /> : "+"}
          </button>
        </div>

        <button
          className="cart-remove-btn"
          disabled={removing === item.productId._id}
          onClick={() => removeItem(item.productId._id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}