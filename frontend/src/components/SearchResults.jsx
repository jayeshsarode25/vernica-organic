import { useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";

const SearchResults = () => {
  const { results, loading, error, query } = useSelector((state) => state.search);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || query;

  if (!searchQuery) return null; // show nothing if no active search

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Results for <span className="text-green-700">"{searchQuery}"</span>
      </h2>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-red-500">Something went wrong: {error}</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">No products found for "{searchQuery}".</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="border rounded-xl overflow-hidden hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <p className="font-medium text-gray-800 text-sm">{product.name}</p>
              <p className="text-green-700 font-semibold text-sm mt-1">₹{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SearchResults;