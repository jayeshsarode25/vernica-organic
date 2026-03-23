import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/reducer/Categoryslice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
 
const CategorySlider = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
 
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
 
  const scroll = (direction) => {
    const container = document.getElementById('category-slider');
    const scrollAmount = 400;
    const newPosition =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
 
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
  };
 
  if (loading) {
    return (
      <section className="py-12 px-6 bg-white">
        <div className="animate-pulse flex gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-72 h-80 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </section>
    );
  }
 
  const activeCategories = categories.filter((cat) => cat.isActive);
 
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-600 mt-1">
              Explore our premium product categories
            </p>
          </div>
          <div className="flex gap-2 hidden sm:flex">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
 
        {/* Slider */}
        <div
          id="category-slider"
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 -mx-6 px-6"
        >
          {activeCategories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="flex-shrink-0 w-72 group"
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 h-80 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-bold text-blue-600">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>
 
                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {category.productCount} products
                    </span>
                    <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
 
export default CategorySlider;