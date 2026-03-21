import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, onClick}) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-[1.01] transition duration-300 overflow-hidden cursor-pointer"
     onClick={onClick} 
     >
      <img
        src={product.productImage[0]?.url}
        alt={product.productName}
        className="w-full h-48 object-contain bg-gray-100"
      />

      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
          {product.productName}
        </h2>

        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
          {product.productDescription}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-green-600">
            ₹{product.productPrice}
          </span>

          <span className="text-[10px] bg-gray-100 px-2 py-1 rounded">
            {product.brand}
          </span>
        </div>

        <button className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition text-sm">
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
