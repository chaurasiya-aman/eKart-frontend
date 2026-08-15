import api from "@/api/axios";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function ProductCard({ product, onClick }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [qty, setQty] = useState(0);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // GET CURRENT QUANTITY
  // --------------------------------------------------
  useEffect(() => {
    const fetchQuantity = async () => {
      try {
        const res = await api.get(
          `${API_URL}/api/v1/cart`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          const items =
            res.data.cart?.items || [];

          const cartItem = items.find(
            (i) =>
              i &&
              i.productId &&
              i.productId._id === product._id
          );

          if (cartItem) {
            setQty(cartItem.quantity);
          } else {
            setQty(0);
          }
        }
      } catch (error) {
        console.log(
          "Failed to fetch cart quantity:",
          error
        );
      }
    };

    fetchQuantity();
  }, [product._id, API_URL]);

  // --------------------------------------------------
  // ADD PRODUCT TO CART
  // --------------------------------------------------
  const addToCart = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        `${API_URL}/api/v1/cart/add`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setQty(1);

        toast.success(
          res.data.message ||
            "Product added to cart"
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CHANGE QUANTITY
  // --------------------------------------------------
  const changeQty = async (delta) => {
    // Don't allow quantity below 0
    const newQty = qty + delta;

    if (newQty < 0) {
      return;
    }

    // If quantity becomes 0,
    // remove the product completely.
    if (newQty === 0) {
      await removeFromCart();
      return;
    }

    const type =
      delta === 1
        ? "increase"
        : "decrease";

    try {
      setLoading(true);

      const res = await api.put(
        `${API_URL}/api/v1/cart/update-qty`,
        {
          productId: product._id,
          type,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedItem =
          res.data.cart?.items?.find(
            (i) =>
              i &&
              i.productId &&
              i.productId._id ===
                product._id
          );

        if (updatedItem) {
          setQty(updatedItem.quantity);
        } else {
          setQty(0);
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update quantity"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // REMOVE FROM CART
  // --------------------------------------------------
  const removeFromCart = async () => {
    try {
      setLoading(true);

      const res = await api.delete(
        `${API_URL}/api/v1/cart/${product._id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setQty(0);

        toast.success(
          res.data.message ||
            "Product removed from cart"
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to remove product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

      {/* IMAGE */}
      <div
        className="relative overflow-hidden bg-gray-50 cursor-pointer"
        onClick={onClick}
      >
        <img
          src={product.productImage?.[0]?.url}
          alt={product.productName}
          className="w-full h-44 sm:h-52 object-contain p-3 group-hover:scale-105 transition-transform duration-300"
        />

        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-600 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-gray-100 shadow-sm">
          {product.brand}
        </span>

        <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">

        <h2
          className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 leading-snug cursor-pointer hover:text-blue-600 transition-colors"
          onClick={onClick}
        >
          {product.productName}
        </h2>

        <p className="text-gray-400 text-xs line-clamp-2 flex-1 leading-relaxed">
          {product.productDescription}
        </p>

        {/* PRICE */}
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50">
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            ₹
            {product.productPrice.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        {/* CART CONTROLS */}
        <div className="mt-1">

          {/* NOT IN CART */}
          {qty === 0 ? (
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white py-2.5 rounded-xl transition-colors duration-200 text-xs sm:text-sm font-semibold disabled:opacity-50 cursor-pointer"
              onClick={addToCart}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <ShoppingCart size={15} />
                  Add to Cart
                </>
              )}
            </button>
          ) : (

            /* IN CART */
            <div className="w-full flex items-center justify-between bg-blue-600 text-white py-2 px-3 rounded-xl">

              {/* DECREASE */}
              <button
                type="button"
                onClick={() =>
                  changeQty(-1)
                }
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 transition-colors text-lg font-light"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-3 h-3" />
                ) : (
                  "−"
                )}
              </button>

              {/* QUANTITY */}
              <span className="text-sm font-bold">
                {qty}
              </span>

              {/* INCREASE */}
              <button
                type="button"
                onClick={() =>
                  changeQty(1)
                }
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 transition-colors text-lg font-light"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-3 h-3" />
                ) : (
                  "+"
                )}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}