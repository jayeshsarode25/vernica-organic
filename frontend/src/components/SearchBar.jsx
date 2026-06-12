import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setQuery, setResults, clearResult } from "../redux/reducer/searchSlice";

const SearchBar = ({ close }) => {
  const [text, setText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownResults, setDropdownResults] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const products = useSelector((state) => state.products.list);

  // ── Live dropdown filtering while typing ──────────────────────
  useEffect(() => {
    if (!text.trim()) {
      setDropdownResults([]);
      setShowDropdown(false);
      dispatch(clearResult());
      return;
    }

    const q = text.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||        
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );

    setDropdownResults(filtered.slice(0, 6));
    setShowDropdown(true);
  }, [text, products]);

  // ── Close dropdown on outside click ───────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Shared filter + navigate logic ────────────────────────────
  const doSearch = (searchText) => {
    if (!searchText.trim()) return;

    const q = searchText.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );

    dispatch(setQuery(searchText));
    dispatch(setResults(filtered));
    setShowDropdown(false);
    setText("");
    close?.();
    navigate(`/search?q=${encodeURIComponent(searchText)}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    doSearch(text);
  };

  // ── Click dropdown item → go to product page ──────────────────
  const handleDropdownClick = (product) => {
    setShowDropdown(false);
    setText("");
    close?.();
    navigate(`/product/${product._id}`);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={submitHandler} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => dropdownResults.length > 0 && setShowDropdown(true)}
          className="border px-3 py-2 rounded-lg outline-none w-64 focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>

      {/* ── Dropdown results ── */}
      {showDropdown && dropdownResults.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {dropdownResults.map((product) => (
            <button
              key={product._id}
              type="button"
              onClick={() => handleDropdownClick(product)}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition text-left"
            >
              {/* ✅ images[0].url — was product.image (wrong) */}
              <img
                src={product.images?.[0]?.url}
                alt={product.title}
                loading="lazy"
                className="w-10 h-10 object-cover rounded-md flex-shrink-0 bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                {/* ✅ title — was product.name (wrong) */}
                <p className="text-sm font-medium text-gray-800 truncate">
                  {product.title}
                </p>
                {/* ✅ price.amount — was product.price (wrong) */}
                <p className="text-xs text-green-700 font-semibold">
                  ₹{product.price?.amount}
                </p>
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={() => doSearch(text)}
            className="w-full px-4 py-2 text-sm text-center text-green-700 font-medium border-t hover:bg-green-50 transition"
          >
            View all results for "{text}"
          </button>
        </div>
      )}

      {/* ── No results dropdown ── */}
      {showDropdown && text.trim() && dropdownResults.length === 0 && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 px-4 py-3">
          <p className="text-sm text-gray-500">No products found for "{text}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
