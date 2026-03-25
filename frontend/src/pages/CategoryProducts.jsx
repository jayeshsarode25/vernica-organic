import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { featchProducts } from "../redux/reducer/productSlice";
import { fetchCategories } from "../redux/reducer/Categoryslice";
import ProductCart from "../components/products/ProductCart";

const CategoryProducts = () => {
  const dispatch = useDispatch();
  const { slug } = useParams(); // /category/:slug

  const { list: products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(featchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // ── find the matched category by slug ─────────────────────────
  const currentCategory = Array.isArray(categories)
    ? categories.find((cat) => cat.slug === slug)
    : null;

  // ── filter products by categoryId ─────────────────────────────
  const categoryProducts = currentCategory
    ? products.filter(
        (p) =>
          p.categoryId?._id === currentCategory._id ||
          p.categoryId === currentCategory._id
      )
    : [];

  // ── loading ────────────────────────────────────────────────────
  if (productsLoading) {
    return (
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
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

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          {/* <Link to="/product" className="hover:text-emerald-600 transition-colors">
            Products
          </Link>
          <span>/</span> */}
          <span className="text-gray-800 font-medium capitalize">
            {currentCategory?.name ?? slug}
          </span>
        </div>

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
            {currentCategory?.name ?? slug}
          </h1>
          {currentCategory?.description && (
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              {currentCategory.description}
            </p>
          )}
          <p className="text-sm text-gray-400 mt-1">
            {categoryProducts.length} product{categoryProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* ── Products Grid ── */}
        {categoryProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              No products found in this category.
            </p>
            <Link
              to="/products"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCart key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;