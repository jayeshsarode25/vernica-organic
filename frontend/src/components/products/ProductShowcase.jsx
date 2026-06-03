import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { featchProducts } from "../../redux/reducer/productSlice";
import { fetchCategories } from "../../redux/reducer/Categoryslice";
import ProductCart from "./ProductCart"; 

const ProductShowcase = () => {
  const dispatch = useDispatch();

  const { list: products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { categories, subCategories } = useSelector((state) => state.categories);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSubFilter, setSelectedSubFilter] = useState("All");

  useEffect(() => {
    dispatch(featchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // ── filtering ──────────────────────────────────────────────────
  const categoryFiltered =
    selectedFilter === "All"
      ? products
      : products.filter(
          (p) =>
            p.categoryId?._id === selectedFilter ||
            p.categoryId === selectedFilter
        );

  const filteredProducts =
    selectedSubFilter === "All"
      ? categoryFiltered
      : categoryFiltered.filter((p) => p.subCategory === selectedSubFilter);

  // ── loading skeleton ───────────────────────────────────────────
  if (productsLoading) {
    return (
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          Featured Products
        </h2>

        {/* ── Category Filter Buttons ── */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedFilter("All")}
            className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all ${
              selectedFilter === "All"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            All
          </button>

          {Array.isArray(categories) &&
            categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedFilter(cat._id)}
                className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all ${
                  selectedFilter === cat._id
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedSubFilter("All")}
            className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all ${
              selectedSubFilter === "All"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            All
          </button>

          {Array.isArray(subCategories) &&
            subCategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => setSelectedSubFilter(sub.slug)}
                className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all ${
                  selectedSubFilter === sub.slug
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                }`}
              >
                {sub.name}
              </button>
            ))}
        </div>

        {/* ── Product Grid using ProductCart ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCart key={product._id} product={product} /> // ✅ reusing component
          ))}
        </div>

        {/* ── Empty state ── */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductShowcase;
