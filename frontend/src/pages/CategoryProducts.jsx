import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProductsBySlug, resetCategoryPage } from "../redux/reducer/productSlice";
import { fetchCategories } from "../redux/reducer/Categoryslice";
import ProductCart from "../components/products/ProductCart";

const SORT_OPTIONS = [
  { label: "Newest",      value: "newest"     },
  { label: "Price: Low",  value: "price_asc"  },
  { label: "Price: High", value: "price_desc" },
  { label: "Top Rated",   value: "rating"     },
];

const LIMIT = 12;

const CategoryProducts = () => {
  const dispatch = useDispatch();
  const { slug }  = useParams();

  const { list, loading, error, pagination, category } = useSelector(
    (state) => state.products.categoryPage
  );
  const { subCategories } = useSelector((state) => state.categories);

  const [sort, setSort] = useState("newest");
  const [subCategory, setSubCategory] = useState("All");
  const [skip, setSkip] = useState(0);

  // reset page to 1 when slug or sort changes
  useEffect(() => {
    setSkip(0);
  }, [slug, sort, subCategory]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // fetch from backend — uses dedicated /category-slug/:slug endpoint
  useEffect(() => {
    const params = {
      skip,
      limit: LIMIT,
      sort,
      ...(subCategory !== "All" ? { subCategory } : {}),
    };

    dispatch(resetCategoryPage());
    dispatch(fetchProductsBySlug({ slug, params }));
  }, [dispatch, slug, sort, skip, subCategory]);

  // cleanup on unmount
  useEffect(() => () => dispatch(resetCategoryPage()), [dispatch]);

  const totalPages  = Math.ceil((pagination?.total ?? 0) / LIMIT);
  const currentPage = Math.floor(skip / LIMIT) + 1;

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(LIMIT)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/product" className="text-emerald-600 underline text-sm">
          Browse all products
        </Link>
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
          <Link to="/product" className="hover:text-emerald-600 transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium capitalize">
            {category?.name ?? slug}
          </span>
        </div>

        {/* ── Header + Sort ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
              {category?.name ?? slug}
            </h1>
            {category?.description && (
              <p className="text-gray-500 mt-1 text-sm">{category.description}</p>
            )}
            <p className="text-sm text-gray-400 mt-1">
              {pagination?.total ?? 0} product{pagination?.total !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-start sm:self-auto">
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 bg-white"
            >
              <option value="All">All</option>
              {Array.isArray(subCategories) &&
                subCategories.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 bg-white"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Products Grid ── */}
        {list.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              No products found in this category.
            </p>
            <Link
              to="/product"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((product) => (
              <ProductCart key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => setSkip((p) => Math.max(0, p - LIMIT))}
              disabled={skip === 0}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              ← Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setSkip(i * LIMIT)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-emerald-600 text-white"
                    : "border hover:bg-gray-100 text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setSkip((p) => p + LIMIT)}
              disabled={skip + LIMIT >= (pagination?.total ?? 0)}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryProducts;
