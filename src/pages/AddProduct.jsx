import { useState } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ProductImageUploader from "@/components/ProductImageUploader";

export default function AddProduct() {
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    category: "",
    brand: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      return toast.error("Please upload product images");
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("productName", formData.productName);
      data.append("productDescription", formData.productDescription);
      data.append("productPrice", formData.productPrice);
      data.append("category", formData.category);
      data.append("brand", formData.brand);

      images.forEach((img) => {
        data.append("files", img.file);
      });

      const res = await api.post("/api/v1/product/add", data);

      if (res.data.success) {
        toast.success(res.data.message);

        setFormData({
          productName: "",
          productDescription: "",
          productPrice: "",
          category: "",
          brand: "",
        });

        setImages([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Add Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>

            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Product Description
            </label>

            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Price
              </label>

              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                placeholder="Enter product price"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Product Images
            </label>

            <ProductImageUploader images={images} onChange={setImages} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
