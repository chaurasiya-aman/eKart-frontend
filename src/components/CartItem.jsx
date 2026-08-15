import api from "@/api/axios";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CartItem({
  items,
  item,
  setItems,
  fmt,
}) {
  const [removing, setRemoving] = useState(null);
  const [loadingQty, setLoadingQty] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Safety check
  if (!item || !item.productId) {
    return null;
  }

  const product = item.productId;

  const changeQty = async (cartItemId, delta) => {
    const targetItem = items.find(
      (i) => i && i._id === cartItemId
    );

    if (!targetItem || !targetItem.productId) {
      return;
    }

    // Don't allow quantity below 1
    if (
      targetItem.quantity <= 1 &&
      delta === -1
    ) {
      return;
    }

    const type =
      delta === 1 ? "increase" : "decrease";

    try {
      setLoadingQty(cartItemId);

      console.log("Sending quantity update:", {
        productId: targetItem.productId._id,
        type,
        delta,
      });

      const res = await api.put(
        `${API_URL}/api/v1/cart/update-qty`,
        {
          productId: targetItem.productId._id,
          type,
        },
        {
          withCredentials: true,
        }
      );

      console.log(
        "Backend cart response:",
        res.data
      );

      if (res.data.success) {
        const updatedItems =
          res.data.cart?.items || [];

        const validItems =
          updatedItems.filter(
            (i) =>
              i &&
              i.productId
          );

        // Backend is the source of truth
        setItems(validItems);
      } else {
        toast.error(
          res.data.message ||
            "Failed to update quantity"
        );
      }
    } catch (error) {
      console.error(
        "Quantity update error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update quantity"
      );
    } finally {
      setLoadingQty(null);
    }
  };

  const removeItem = async (productId) => {
    const previousItems = [...items];

    try {
      setRemoving(productId);

      // Optimistically remove from UI
      setItems((prev) =>
        prev.filter(
          (i) =>
            i &&
            i.productId &&
            i.productId._id !== productId
        )
      );

      const res = await api.delete(
        `${API_URL}/api/v1/cart/${productId}`,
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        setItems(previousItems);

        toast.error(
          res.data.message ||
            "Failed to remove item"
        );
      }
    } catch (error) {
      setItems(previousItems);

      toast.error(
        error?.response?.data?.message ||
          "Failed to remove item"
      );
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div
      className="cart-item"
      style={{
        opacity:
          removing === product._id
            ? 0.4
            : 1,

        pointerEvents:
          removing === product._id
            ? "none"
            : "auto",
      }}
    >
      {/* IMAGE */}
      <img
        src={
          product?.productImage?.[0]?.url
        }
        alt={
          product?.productName ||
          "Product"
        }
        className="cart-item-img"
        onError={(e) => {
          e.target.src =
            "/fallback.png";
        }}
      />

      {/* PRODUCT INFO */}
      <div className="cart-item-info">
        <div className="cart-item-name">
          {product?.productName}
        </div>

        <div className="cart-item-price">
          {fmt(
            product?.productPrice || 0
          )}{" "}
          each
        </div>

        <span className="cart-item-tag">
          {product?.category}
        </span>

        <span className="cart-item-tag">
          {product?.brand}
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="cart-item-right">

        {/* TOTAL */}
        <div className="cart-item-total">
          {fmt(
            (item.price || 0) *
              (item.quantity || 1)
          )}
        </div>

        {/* QUANTITY */}
        <div className="cart-qty-ctrl">

          {/* DECREASE */}
          <button
            type="button"
            className="cart-qty-btn"
            disabled={
              loadingQty ===
                item._id ||
              item.quantity <= 1
            }
            onClick={() =>
              changeQty(
                item._id,
                -1
              )
            }
          >
            {loadingQty ===
            item._id ? (
              <Loader2 className="animate-spin w-3 h-3" />
            ) : (
              "−"
            )}
          </button>

          {/* QUANTITY NUMBER */}
          <div className="cart-qty-num">
            {item.quantity}
          </div>

          {/* INCREASE */}
          <button
            type="button"
            className="cart-qty-btn"
            disabled={
              loadingQty ===
              item._id
            }
            onClick={() =>
              changeQty(
                item._id,
                1
              )
            }
          >
            {loadingQty ===
            item._id ? (
              <Loader2 className="animate-spin w-3 h-3" />
            ) : (
              "+"
            )}
          </button>
        </div>

        {/* REMOVE */}
        <button
          type="button"
          className="cart-remove-btn"
          disabled={
            removing ===
            product._id
          }
          onClick={() =>
            removeItem(
              product._id
            )
          }
        >
          Remove
        </button>
      </div>
    </div>
  );
}