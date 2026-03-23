import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
 
const CategoryProducts = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
 
  useEffect(() => {
    fetchCategoryProducts();
  }, [slug, sortBy]);
 
  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3002/api/products/category-slug/${slug}?sort=${sortBy}&skip=0&limit=20`
      );
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setCategory(data.category);
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/shop-by-category"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Categories
        </Link>
 
        {/* Category Header */}
        {category && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {category.name}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              {category.description}
            </p>
          </div>
        )}
 
        {/* Toolbar */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {products.length} products
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>
 
        {/* Products Grid */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/shop-by-category"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Categories
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">
              No products in this category yet
            </p>
            <Link
              to="/shop-by-category"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
 
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group">
      {/* Image */}
      <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
 
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
 
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.round(product.rating))}
            </div>
            <span className="text-xs text-gray-600">{product.rating}</span>
          </div>
        )}
 
        {/* Price */}
        <p className="text-xl font-bold text-gray-900 mb-4">
          ₹{product.price?.amount || 0}
        </p>
 
        {/* Button */}
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};
 
export default CategoryProducts;