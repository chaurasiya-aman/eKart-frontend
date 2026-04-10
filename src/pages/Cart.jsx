import api from "@/api/axios";
import CartItem from "@/components/CartItem";
import OrderCard from "@/components/OrderCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import "@/utils/Cart.css";

function fmt(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const getItem = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${API_URL}/api/v1/cart`);
      if (res.data.success) setItems(res.data.cart.items);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  const count = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="cart-wrap">
      <div className="cart-header">
        <h1 className="cart-h1">Your Cart</h1>
        <p className="cart-subtext">
          {count} {count === 1 ? "item" : "items"} in your bag
        </p>
      </div>

      {items.length > 0 && (
        <div className="cart-savings-banner">
          <div className="cart-savings-dot" />
          🎉 Free delivery applied on your order!
        </div>
      )}

      <div className="cart-layout">
        <div className="cart-items-list">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="font-semibold text-gray-400 text-base">Your cart is empty</p>
              <p className="text-xs mt-1 text-gray-300 mb-4">Looks like you haven't added anything yet</p>
              <Link
                to="/products"
                className="inline-block bg-gray-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                items={items}
                setItems={setItems}
                fmt={fmt}
              />
            ))
          )}
        </div>

        {items.length > 0 && <OrderCard fmt={fmt} items={items} />}
      </div>
    </div>
  );
}