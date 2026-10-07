import { useEffect, useId, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "@/utils/ProductSearch.css";

export default function ProductSearch({ className = "", onSearchComplete }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(currentSearch);
  const inputId = useId();

  useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const search = query.trim();
    navigate(search ? `/products?search=${encodeURIComponent(search)}` : "/products");
    onSearchComplete?.();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`product-search ${className}`.trim()}
    >
      <label className="sr-only" htmlFor={inputId}>
        Search products
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products..."
        className="product-search__input"
      />
      <button
        type="submit"
        className="product-search__button"
        aria-label="Search products"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
      </button>
    </form>
  );
}
