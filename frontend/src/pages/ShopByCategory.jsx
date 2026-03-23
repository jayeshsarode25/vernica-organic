import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/reducer/Categoryslice';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
 
const ShopByCategory = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
 
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
 
  const activeCategories = categories.filter((cat) => cat.isActive);
 
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our premium collection of beauty and wellness products
          </p>
        </div>
 
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCategories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="group"
            >
              {/* Category Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Image/Icon Area */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300 rounded-full -ml-12 -mb-12"></div>
                  </div>
 
                  {/* Category Initial Icon */}
                  <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-4xl font-bold text-blue-600">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
 
                {/* Content */}
                <div className="p-6">
                  {/* Category Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
 
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {category.description}
                  </p>
 
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      {category.productCount} Products
                    </span>
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {category.slug}
                    </span>
                  </div>
 
                  {/* CTA Button */}
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium group/btn">
                    Shop Now
                    <ArrowRight
                      size={18}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
 
        {activeCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No categories available at the moment
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
 
export default ShopByCategory;