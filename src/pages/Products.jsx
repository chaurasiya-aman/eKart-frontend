import api from "@/api/axios";
import FilterSideBar from "@/components/FilterSideBar";
import ProductCard from "@/components/ProductCard";
import { setProducts } from "@/redux/productSlice";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Products() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    categories: [],
    brands: [],
    price: 100000,
  });

  const getAllProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get(`${API_URL}/api/v1/product/all-products`);
      
      if (res.data.success) {
        setProduct(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = product.filter((p) => {
    const categoryMatch =
      filter.categories.length === 0 || filter.categories.includes(p?.category);

    const brandMatch =
      filter.brands.length === 0 || filter.brands.includes(p?.brand);

    const priceMatch = (p?.productPrice || 0) <= filter.price;

    return categoryMatch && brandMatch && priceMatch;
  });

  const controller = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gray-100">
      {/* Page Layout */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="lg:w-72">
          <FilterSideBar filter={filter} setFilter={setFilter} />
        </div>

        {/* Products Grid */}
        <div className="flex-1 p-3 md:p-5">
          {product.length === 0 ? (
            <p className="text-gray-500 text-lg text-center">
              No products loaded
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-gray-500 text-lg text-center">
              No products match selected filters
            </p>
          ) : (
            <div
              className="grid gap-3
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-3"
            >
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onClick={() => controller(prod._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
