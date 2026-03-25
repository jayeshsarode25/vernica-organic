import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/reducer/Categoryslice'
import { Link, useParams } from 'react-router-dom';
 
const CategorySidebar = ({ onSelectCategory }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { slug } = useParams();
 
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
 
  const activeCategories = categories.filter((cat) => cat.isActive);
 
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <h3 className="text-lg font-bold">Categories</h3>
      </div>
 
      {/* Content */}
      <div className="p-4 space-y-2">
        {/* All Products */}
        <Link
          to="/product"
          className={`block px-4 py-3 rounded-lg font-medium transition ${
            !slug
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Products
        </Link>
 
        {/* Categories */}
        {activeCategories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category.slug}`}
            className={`block px-4 py-3 rounded-lg transition ${
              slug === category.slug
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{category.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                slug === category.slug
                  ? 'bg-blue-200'
                  : 'bg-gray-200'
              }`}>
                {category.productCount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
 
export default CategorySidebar;