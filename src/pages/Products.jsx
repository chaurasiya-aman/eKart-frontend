import api from "@/api/axios";
import FilterSideBar from "@/components/FilterSideBar";
import ProductCard from "@/components/ProductCard";
import { setProducts } from "@/redux/productSlice";
import { Loader2, PackageSearch } from "lucide-react";
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

  useEffect(() => {
    getAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin w-10 h-10 text-gray-400" />
        <p className="text-sm text-gray-400 font-medium">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gray-50">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        <div className="lg:w-72 lg:min-h-screen lg:sticky lg:top-16 lg:self-start">
          <FilterSideBar filter={filter} setFilter={setFilter} />
        </div>

        <div className="flex-1 p-3 sm:p-5">
          <div className="mb-4 sm:mb-5 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                All Products
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {product.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <PackageSearch className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400 font-medium">No products loaded</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <PackageSearch className="w-12 h-12 text-gray-200" />
              <p className="text-gray-500 font-semibold">No products match your filters</p>
              <p className="text-gray-400 text-sm">Try adjusting or resetting your filters</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onClick={() => navigate(`/product/${prod._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}