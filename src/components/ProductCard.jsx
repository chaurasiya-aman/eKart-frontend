import api from "@/api/axios";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function ProductCard({ product, onClick }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [qty, setQty] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuantity = async () => {
      try {
        const res = await api.get(`${API_URL}/api/v1/cart`, { withCredentials: true });
        if (res.data.success) {
          const cartItem = res.data.cart.items.find(
            (i) => i.productId._id === product._id
          );
          if (cartItem) setQty(cartItem.quantity);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuantity();
  }, [product._id]);

  const updateCart = async (newQty) => {
    try {
      setLoading(true);
      await api.post(
        `${API_URL}/api/v1/cart/add`,
        { productId: product._id, quantity: newQty },
        { withCredentials: true }
      );
      setQty(newQty);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <div
        className="relative overflow-hidden bg-gray-50 cursor-pointer"
        onClick={onClick}
      >
        <img
          src={product.productImage[0]?.url}
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

        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50">
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            ₹{product.productPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="mt-1">
          {qty === 0 ? (
            <button
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white py-2.5 rounded-xl transition-colors duration-200 text-xs sm:text-sm font-semibold disabled:opacity-50 cursor-pointer"
              onClick={() => updateCart(1)}
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
            <div className="w-full flex items-center justify-between bg-blue-600 text-white py-2 px-3 rounded-xl">
              <button
                onClick={() => updateCart(qty - 1)}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 transition-colors text-lg font-light"
              >
                {loading ? <Loader2 className="animate-spin w-3 h-3" /> : "−"}
              </button>
              <span className="text-sm font-bold">{qty}</span>
              <button
                onClick={() => updateCart(qty + 1)}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 transition-colors text-lg font-light"
              >
                {loading ? <Loader2 className="animate-spin w-3 h-3" /> : "+"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}