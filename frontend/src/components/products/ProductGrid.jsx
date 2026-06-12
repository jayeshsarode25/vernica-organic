import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { featchProducts } from "../../redux/reducer/productSlice";
import ProductCard from "./ProductCart";
import ProductLoader from "./ProductLoader";

const ProductGridContent = ({
  q,
  selectedCategory = "All",
  selectedSubCategory = "All",
}) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    list = [],
    loading,
    error,
    pagination = {},
  } = useSelector((state) => state.products || {});

  const { limit = 10, total = 0 } = pagination;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const buildParams = useCallback(
    (page = 1) => ({
      skip: (page - 1) * limit,
      limit,
      ...(selectedCategory !== "All" ? { categoryId: selectedCategory } : {}),
      ...(selectedSubCategory !== "All"
        ? { subCategory: selectedSubCategory }
        : {}),
      ...(q.trim() ? { q: q.trim() } : {}),
    }),
    [limit, q, selectedCategory, selectedSubCategory],
  );

  useEffect(() => {
    dispatch(featchProducts(buildParams(currentPage)));
  }, [buildParams, currentPage, dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductLoader key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-10 font-medium">{error}</p>
    );
  }

  if (!list.length) {
    return (
      <p className="text-center mt-10 text-gray-500">No products found</p>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-400 mb-4">
        Showing {list.length} product{list.length !== 1 ? "s" : ""}
        {selectedCategory !== "All" ? " in this category" : ""}
        {selectedSubCategory !== "All" ? ` for ${selectedSubCategory}` : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {list.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="flex flex-wrap justify-center items-center mt-12 gap-3">
        <button
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="px-5 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-40"
          type="button"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-10 w-10 rounded-lg border text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              type="button"
            >
              {page}
            </button>
          );
        })}

        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
          disabled={currentPage >= totalPages}
          className="px-5 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-40"
          type="button"
        >
          Next
        </button>
      </div>
    </>
  );
};

const ProductGrid = ({ selectedCategory = "All", selectedSubCategory = "All" }) => {
  const q = useSelector((state) => state.search.query) || "";
  const resetKey = useMemo(
    () => JSON.stringify({ q: q.trim(), selectedCategory, selectedSubCategory }),
    [q, selectedCategory, selectedSubCategory],
  );

  return (
    <ProductGridContent
      key={resetKey}
      q={q}
      selectedCategory={selectedCategory}
      selectedSubCategory={selectedSubCategory}
    />
  );
};

export default ProductGrid;
