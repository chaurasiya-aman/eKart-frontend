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
import "@/utils/FilterSideBar.css";

export default function FilterSideBar({ filter, setFilter }) {
  const [open, setOpen] = useState(false);

  const allProducts = useSelector((state) => state.product?.products || []);

  const allCategories = [
    ...new Set(allProducts.map((product) => product.category).filter(Boolean)),
  ];

  const allBrands = [
    ...new Set(allProducts.map((product) => product.brand).filter(Boolean)),
  ];

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

  const handleBrandChange = (value) => {
    if (value === "ALL") {
      setFilter((prev) => ({ ...prev, brands: [] }));
    } else {
      setFilter((prev) => ({ ...prev, brands: [value] }));
    }
  };

  return (
    <>
      <div className="fs-mobile-btn-wrap">
        <button className="fs-mobile-btn" onClick={() => setOpen(true)}>
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {open && (
        <div
          className="fs-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fs-sidebar ${open ? "fs-open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fs-mobile-header">
          <h2 className="fs-title">Filters</h2>
          <button className="fs-close-btn" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="fs-desktop-title">
          <h2 className="fs-title">Filters</h2>
        </div>

        <div className="fs-section">
          <p className="fs-section-label">Category</p>
          <div className="fs-checkbox-list">
            {allCategories.map((category) => (
              <label key={category} className="fs-checkbox-label">
                <input
                  type="checkbox"
                  className="fs-checkbox"
                  checked={filter.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        <hr className="fs-divider" />

        <div className="fs-section">
          <p className="fs-section-label">Brand</p>
          <Select
            onValueChange={handleBrandChange}
            value={filter.brands[0] || "ALL"}
          >
            <SelectTrigger className="fs-select-trigger">
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Brands</SelectLabel>
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

        <hr className="fs-divider" />

        <div className="fs-section">
          <p className="fs-section-label">Price Range</p>
          <div className="fs-range-wrap">
            <input
              type="range"
              min="0"
              max="100000"
              className="fs-range"
              value={filter.price}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, price: Number(e.target.value) }))
              }
            />
            <div className="fs-range-labels">
              <span>₹0</span>
              <span className="fs-price-value">₹{filter.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <hr className="fs-divider" />

        <button
          className="fs-reset-btn"
          onClick={() =>
            setFilter({ categories: [], brands: [], price: 100000 })
          }
        >
          Reset Filters
        </button>
      </div>
    </>
  );
}