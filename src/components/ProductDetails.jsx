import { useState } from "react";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductDetails({ product }) {
  const [mainImage, setMainImage] = useState(product?.productImage[0]?.url);
  const navigate = useNavigate();
  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: Images */}
      <div>
        <img
          src={mainImage || product?.productImage?.[0]?.url}
          alt={product.productName}
          className="w-full h-96 object-contain bg-gray-100 rounded-lg"
        />

        {/* Thumbnails */}
        <div className="flex gap-3 mt-4">
          {product.productImage?.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt="thumb"
              onClick={() => setMainImage(img.url)}
              className={`w-20 h-20 object-contain border rounded cursor-pointer p-1 
              ${mainImage === img.url ? "border-blue-500" : "border-gray-200"}`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Details */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {product.productName}
        </h1>

        <p className="text-gray-500 mt-2">{product.productDescription}</p>

        <div className="mt-4">
          <span className="text-3xl font-bold text-green-600">
            ₹{product.productPrice}
          </span>
        </div>

        <div className="mt-3">
          <span className="text-sm bg-gray-100 px-3 py-1 mr-5 rounded">
            Brand: {product.brand.toUpperCase()}
          </span>
          <span className="text-sm bg-gray-100 px-3 py-1 rounded">
            Category: {product.category.toUpperCase()}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <ShoppingCart size={18} />
            Add to Cart
          </button>

          <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition">
            Buy Now
          </button>
        </div>

        {/* Extra Info (optional) */}
        <div className="mt-6 text-sm text-gray-600 space-y-2">
          <p>
            <CheckCircle className="w-5 h-5 text-green-600 inline " /> Free
            Delivery
          </p>
          <p>
            <CheckCircle className="w-5 h-5 text-green-600 inline " /> 7 Days
            Replacement
          </p>
          <p>
            <CheckCircle className="w-5 h-5 text-green-600 inline " /> Secure
            Payment
          </p>
        </div>
      </div>
      <button
        className="cursor-pointer flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
}
