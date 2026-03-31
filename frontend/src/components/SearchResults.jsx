import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setQuery, setResults } from "../redux/reducer/searchSlice";
import ProductCart from "../components/products/ProductCart"; 

const SearchResults = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const { results, loading, query } = useSelector((state) => state.search);
  const products = useSelector((state) => state.products.list);

  // ✅ Re-filter if user refreshes /search?q=... directly
  useEffect(() => {
    if (!urlQuery.trim() || products.length === 0) return;
    if (urlQuery === query && results.length > 0) return;

    const q = urlQuery.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
    dispatch(setQuery(urlQuery));
    dispatch(setResults(filtered));
  }, [urlQuery, products]);

  const displayQuery = urlQuery || query;

  if (!displayQuery) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Search Results for{" "}
          <span className="text-green-700">"{displayQuery}"</span>
        </h2>
        {!loading && (
          <p className="text-sm text-gray-400 mt-1">
            {results.length} product{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* ── Loading skeletons (matches your card size) ── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border rounded-2xl p-4 shadow-sm bg-white animate-pulse"
            >
              <div className="w-full h-56 bg-gray-200 rounded-xl mb-4" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full mb-1" />
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
              <div className="flex justify-between mb-3">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-100 rounded w-14" />
              </div>
              <div className="h-11 bg-gray-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      )}

      {/* ── No results ── */}
      {!loading && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 text-lg font-medium">
            No products found for "{displayQuery}"
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Try searching with a different keyword
          </p>
        </div>
      )}

      {/* ── Results grid — uses your exact ProductCard ── */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCart key={product._id} product={product} /> 
          ))}
        </div>
      )}

    </section>
  );
};

export default SearchResults;