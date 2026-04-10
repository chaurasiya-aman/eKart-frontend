import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import ProductDetails from "@/components/ProductDetails";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const getProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${API_URL}/api/v1/product/${id}`);
      if (res.data.success) setProduct(res.data.product);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-700" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-sm px-4 text-center">
        Product not found
      </div>
    );
  }

  return <ProductDetails product={product} />;
}