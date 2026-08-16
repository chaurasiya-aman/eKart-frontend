import { useState, useEffect } from "react";
import {
  CheckCircle,
  ShoppingCart,
  ArrowLeft,
  Zap,
  RotateCcw,
  Trash2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import api from "@/api/axios";

export default function ProductDetails({ product }) {
  const defaultImage = product?.productImage?.[0]?.url;

  const [mainImage, setMainImage] = useState(defaultImage);

  const [loading, setLoading] = useState(false);

  const [addingToCart, setAddingToCart] = useState(false);

  const [qty, setQty] = useState(0);

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchCartQuantity = async () => {
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
            (item) =>
              item &&
              item.productId &&
              item.productId._id === product._id
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

    if (product?._id) {
      fetchCartQuantity();
    }
  }, [product?._id, API_URL]);


  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

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
          "Failed to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };


  const changeQty = async (delta) => {
    const newQty = qty + delta;

    if (newQty < 0) {
      return;
    }

    if (newQty === 0) {
      await handleRemoveFromCart();
      return;
    }

    const type =
      delta === 1
        ? "increase"
        : "decrease";

    try {
      setAddingToCart(true);

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
        const updatedItems =
          res.data.cart?.items || [];

        const updatedItem =
          updatedItems.find(
            (item) =>
              item &&
              item.productId &&
              item.productId._id ===
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
      setAddingToCart(false);
    }
  };


  const handleRemoveFromCart = async () => {
    try {
      setAddingToCart(true);

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
      setAddingToCart(false);
    }
  };


  const handleBuyNow = async () => {
    navigate("/cart");
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );

      if (!confirmDelete) return;

      setLoading(true);

      const res = await api.delete(
        `/api/v1/product/delete/${id}`
      );

      if (res.data.success) {
        toast.success(res.data.message);

        navigate("/products");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setLoading(false);
    }
  };

  const isDefault =
    mainImage === defaultImage;


  if (!product) {
    return (
      <p className="text-center mt-10 text-gray-500 text-sm">
        Product not found
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">


        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 cursor-pointer group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />

          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2">


            <div className="p-5 sm:p-8 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col gap-4">


              <div className="rounded-2xl overflow-hidden bg-white flex items-center justify-center h-56 sm:h-72 md:h-80 shadow-inner">

                <img
                  src={mainImage}
                  alt={product.productName}
                  className="max-h-full max-w-full object-contain p-4"
                  onError={(e) => {
                    e.target.src =
                      "/fallback.png";
                  }}
                />

              </div>


              {product.productImage?.length >
                1 && (
                <div className="flex flex-col items-center gap-3">

                  <div className="flex gap-2 flex-wrap justify-center">

                    {product.productImage.map(
                      (img, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            setMainImage(
                              img.url
                            )
                          }
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 p-1 bg-white transition-all cursor-pointer ${
                            mainImage === img.url
                              ? "border-blue-500 shadow-md"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={`thumb-${index}`}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      )
                    )}

                  </div>


                  {!isDefault && (
                    <button
                      type="button"
                      onClick={() =>
                        setMainImage(
                          defaultImage
                        )
                      }
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 bg-white cursor-pointer"
                    >
                      <RotateCcw
                        size={13}
                      />

                      Reset to default
                    </button>
                  )}

                </div>
              )}

            </div>


            <div className="p-5 sm:p-8 flex flex-col gap-4">


              <div className="flex flex-wrap gap-2">

                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                  {product.category}
                </span>

                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                  {product.brand}
                </span>

              </div>


              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {product.productName}
              </h1>


              <p className="text-gray-500 text-sm leading-relaxed">
                {product.productDescription}
              </p>


              <div className="flex items-baseline gap-3">

                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  ₹
                  {product.productPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>


              <div className="flex flex-col sm:flex-row gap-3 mt-1">


                {qty === 0 ? (

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-gray-900 hover:bg-blue-600 text-white py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer disabled:opacity-60"
                  >
                    {addingToCart ? (
                      <Loader2
                        className="animate-spin"
                        size={17}
                      />
                    ) : (
                      <ShoppingCart
                        size={17}
                      />
                    )}

                    {addingToCart
                      ? "Adding..."
                      : "Add to Cart"}
                  </button>

                ) : (

                  <div className="flex-1 flex items-center justify-between bg-blue-600 text-white py-3 px-4 rounded-xl">


                    <button
                      type="button"
                      onClick={() =>
                        changeQty(-1)
                      }
                      disabled={addingToCart}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xl font-light cursor-pointer"
                    >
                      {addingToCart ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        "−"
                      )}
                    </button>


                    <span className="text-sm font-bold">
                      {qty}
                    </span>


                    <button
                      type="button"
                      onClick={() =>
                        changeQty(1)
                      }
                      disabled={addingToCart}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xl font-light cursor-pointer"
                    >
                      {addingToCart ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        "+"
                      )}
                    </button>

                  </div>
                )}

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl transition-all duration-200 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Zap size={16} />

                  Buy Now
                </button>

              </div>


              {user?.role === "admin" && (
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      product._id
                    )
                  }
                  disabled={loading}
                  className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-xl transition-all duration-200 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {!loading ? (
                    <>
                      <Trash2 size={16} />

                      Delete Product
                    </>
                  ) : (
                    <>
                      <Loader2
                        className="animate-spin"
                        size={18}
                      />

                      Deleting...
                    </>
                  )}
                </button>
              )}


              <div className="mt-2 pt-4 border-t border-gray-100 grid grid-cols-1 gap-2.5">

                {[
                  "Free Delivery on this order",
                  "7 Days Easy Replacement",
                  "Secure & Safe Payment",
                ].map((text) => (
                  <p
                    key={text}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />

                    {text}
                  </p>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}