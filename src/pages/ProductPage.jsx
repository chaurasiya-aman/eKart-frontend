import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import ProductDetails from "@/components/ProductDetails";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const getProduct = async () => {
    try {
      const res = await api.get(`${API_URL}/api/v1/product/${id}`);
      console.log(res)
      if (res.data.success) {
        console.log(res.data.products);
        setProduct(res.data.product);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  return <ProductDetails product={product} />;
}
