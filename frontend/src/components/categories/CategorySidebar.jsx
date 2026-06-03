import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/reducer/Categoryslice";

const CategorySidebar = ({
  selected,
  onSelect,
  selectedSubCategory = "All",
  onSubCategorySelect,
}) => {
  const dispatch = useDispatch();
  const { categories, subCategories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Categories
      </h2>

      {loading ? (
        // Skeleton
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-9 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-1">
          {/* All */}
          <li>
            <button
              onClick={() => onSelect("All")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selected === "All"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Products
            </button>
          </li>

          {/* Dynamic categories */}
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <li key={cat._id}>
                <button
                  onClick={() => onSelect(cat._id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                    selected === cat._id
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.productCount > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        selected === cat._id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.productCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      )}

      <div className="border-t border-gray-100 mt-5 pt-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Sub-category
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onSubCategorySelect?.("All")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedSubCategory === "All"
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All
          </button>

          {Array.isArray(subCategories) &&
            subCategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => onSubCategorySelect?.(sub.slug)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedSubCategory === sub.slug
                    ? "bg-emerald-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {sub.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
