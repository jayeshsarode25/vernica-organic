import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/reducer/categorySlice';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
 
const CategoryGrid = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
 
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
 
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }
 
  const activeCategories = categories.filter((cat) => cat.isActive);
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {activeCategories.map((category) => (
        <Link
          key={category._id}
          to={`/category/${category.slug}`}
          className="group"
        >
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2">
            {/* Header Background */}
            <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full -mr-20 -mt-20"></div>
              </div>
            </div>
 
            {/* Content */}
            <div className="p-6">
              {/* Category Initial */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center -mt-10 relative z-10">
                  <span className="text-2xl font-bold text-blue-600">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-2xl">
                  {category.productCount > 0 ? '→' : ''}
                </span>
              </div>
 
              {/* Text */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>
 
              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-600">
                  {category.productCount} Products
                </span>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {category.slug}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
 
export default CategoryGrid;
 