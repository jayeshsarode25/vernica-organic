import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/reducer/Categoryslice";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ── Add images by slug — fallback used if slug not found ──────────
const CATEGORY_IMAGES = {
  "skin-care": "https://i.pinimg.com/1200x/88/c1/e0/88c1e0c2a0ef5868acb778d2c24fdbfb.jpg",
  "hair-care": "https://i.pinimg.com/1200x/04/55/d8/0455d84d63905fb0958ca01c5c28b4cb.jpg",
  "body-care": "https://i.pinimg.com/736x/9f/ac/e5/9face50cd6e20d2a57d8aeea7dee96cf.jpg",
};

const FALLBACK_IMAGE =
  "https://i.pinimg.com/1200x/88/c1/e0/88c1e0c2a0ef5868acb778d2c24fdbfb.jpg";

const getImage = (slug) => CATEGORY_IMAGES[slug] || FALLBACK_IMAGE;

/**
 * CategorySection — reusable category grid
 *
 * Props:
 *  variant  → "image"    image card with gradient overlay  (default)
 *           → "minimal"  icon initial + description card
 *
 * Usage:
 *   <CategorySection />                  → image variant
 *   <CategorySection variant="minimal" /> → minimal variant
 */
const CategorySection = ({ variant = "image" }) => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const activeCategories = Array.isArray(categories)
    ? categories.filter((cat) => cat.isActive)
    : [];

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Explore our premium collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────
  if (activeCategories.length === 0) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-gray-500 text-lg mt-12">No categories available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-gray-600 text-lg">
            Explore our premium collection of beauty and wellness products
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {activeCategories.map((category) =>
            variant === "minimal" ? (
              // ── Minimal Card ─────────────────────────────────
              <Link key={category._id} to={`/category/${category.slug}`} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Icon area */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full -mr-16 -mt-16" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300 rounded-full -ml-12 -mb-12" />
                    </div>
                    <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-4xl font-bold text-blue-600">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{category.description}</p>

                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-700">
                        {category.productCount ?? 0} Products
                      </span>
                      <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {category.slug}
                      </span>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium group/btn">
                      Shop Now
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </Link>
            ) : (
              // ── Image Card (default) ──────────────────────────
              <Link key={category._id} to={`/category/${category.slug}`} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  {/* Image + gradient */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={getImage(category.slug)}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {category.productCount ?? 0} Products
                    </span>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors group/btn">
                      Shop Now
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
