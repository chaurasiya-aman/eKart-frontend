import { useState } from "react";
import { useSelector } from "react-redux";
import { X, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterSideBar({ filter, setFilter }) {
  const [open, setOpen] = useState(false);

  const allProducts = useSelector((state) => state.product?.products || []);

  const allCategories = [
    ...new Set(allProducts.map((product) => product.category).filter(Boolean)),
  ];

  const allBrands = [
    ...new Set(allProducts.map((product) => product.brand).filter(Boolean)),
  ];

  // Category (multi-select)
  const handleCategoryChange = (category) => {
    setFilter((prev) => {
      const exists = prev.categories.includes(category);

      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  // Brand (single select + ALL)
  const handleBrandChange = (value) => {
    if (value === "ALL") {
      setFilter((prev) => ({
        ...prev,
        brands: [], // no filter → show all
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        brands: [value],
      }));
    }
  };

  return (
    <>
      {/* Mobile Button */}
      <div className="lg:hidden p-3">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-full mt-5 w-72 bg-white shadow-lg p-5 z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Desktop Title */}
        <h2 className="text-xl font-semibold mb-6 hidden lg:block">
          Filters
        </h2>

        {/* Category */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Category</h3>

          <div className="space-y-2 text-sm">
            {allCategories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={filter.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* Brand Select */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Brand</h3>

          <Select
            onValueChange={handleBrandChange}
            value={filter.brands[0] || "ALL"} // controlled
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Brands</SelectLabel>

                {/*  ALL option */}
                <SelectItem value="ALL">ALL</SelectItem>

                {allBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Price Range</h3>

          <input
            type="range"
            min="0"
            max="100000"
            className="w-full"
            value={filter.price}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span>₹{filter.price}</span>
          </div>
        </div>

        {/* Reset */}
        <div className="flex flex-col gap-2">
          <button
            className="border py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() =>
              setFilter({
                categories: [],
                brands: [],
                price: 100000,
              })
            }
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}