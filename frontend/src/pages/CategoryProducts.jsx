import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  fetchProductsBySlug,
  resetCategoryPage,
} from "../redux/reducer/productSlice";
import { fetchCategories } from "../redux/reducer/Categoryslice";
import ProductCart from "../components/products/ProductCart";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low", value: "price_asc" },
  { label: "Price: High", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

const LIMIT = 12;

const CategoryProductsContent = ({ slug }) => {
  const dispatch = useDispatch();

  const { list, loading, error, pagination, category } = useSelector(
    (state) => state.products.categoryPage,
  );
  const { subCategories } = useSelector((state) => state.categories);

  const [sort, setSort] = useState("newest");
  const [subCategory, setSubCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchProductsBySlug({
        slug,
        params: {
          skip: (currentPage - 1) * LIMIT,
          limit: LIMIT,
          sort,
          ...(subCategory !== "All" ? { subCategory } : {}),
        },
      }),
    );
  }, [currentPage, dispatch, slug, sort, subCategory]);

  useEffect(() => () => dispatch(resetCategoryPage()), [dispatch]);

  const totalPages = Math.ceil((pagination?.total ?? 0) / LIMIT);

  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: LIMIT }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg h-80 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
              {category?.name ?? slug}
            </h1>
            {category?.description && (
              <p className="text-gray-500 mt-1 text-sm">{category.description}</p>
            )}
            <p className="text-sm text-gray-400 mt-1">
              {pagination?.total ?? 0} product
              {pagination?.total !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-start sm:self-auto">
            <select
              value={subCategory}
              onChange={handleSubCategoryChange}
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
              onChange={handleSortChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 bg-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40 transition-colors"
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
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-emerald-600 text-white"
                      : "border hover:bg-gray-100 text-gray-600"
                  }`}
                  type="button"
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage >= totalPages}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40 transition-colors"
              type="button"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryProducts = () => {
  const { slug } = useParams();

  return <CategoryProductsContent key={slug} slug={slug} />;
};

export default CategoryProducts;
