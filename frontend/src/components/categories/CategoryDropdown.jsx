import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
 
const CategoryDropdown = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
 
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
 
  const activeCategories = categories.filter((cat) => cat.isActive);
 
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition">
        Categories
        <ChevronDown size={18} className="group-hover:rotate-180 transition-transform" />
      </button>
 
      {/* Dropdown Menu */}
      <div className="absolute left-0 mt-0 w-64 bg-white rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Shop by Category
          </p>
        </div>
 
        {/* Items */}
        <div className="py-2">
          {activeCategories.map((category, index) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className={`block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition ${
                index !== activeCategories.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{category.name}</p>
                  <p className="text-xs text-gray-500">
                    {category.productCount} products
                  </p>
                </div>
                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
 
        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <Link
            to="/shop-by-category"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all categories →
          </Link>
        </div>
      </div>
    </div>
  );
};
 
export default CategoryDropdown;