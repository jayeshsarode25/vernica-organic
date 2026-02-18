import React from 'react'
import { useState } from 'react';

const ProductShowcase = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const products = [ 
    {
      id: 1,
      name: 'Vitamin C Serum',
      category: 'Skin Care',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Hydrating Moisturizer',
      category: 'Skin Care',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Daily Face Wash',
      category: 'Skin Care',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80',
      rating: 4.3
    },
   
    {
      id: 4,
      name: 'Argan Oil Shampoo',
      category: 'Hair Care',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Deep Conditioner',
      category: 'Hair Care',
      price: 26.99,
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&q=80',
      rating: 4.7
    },
    {
      id: 6,
      name: 'Hair Growth Serum',
      category: 'Hair Care',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80',
      rating: 4.4
    },
    {
      id: 7,
      name: 'Leave-In Treatment',
      category: 'Hair Care',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&q=80',
      rating: 4.5
    },
    
    {
      id: 8,
      name: 'Body Butter Cream',
      category: 'Body Care',
      price: 21.99,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80',
      rating: 4.9
    },
  ];

  const categories = ['All', 'Skin Care', 'Hair Care', 'Body Care'];

  const filteredProducts = selectedFilter === 'All' 
    ? products 
    : products.filter(product => product.category === selectedFilter);

  return (
    <div className='w-full p-4 sm:p-6 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800'>
          Featured Products
        </h2>

        
        <div className='flex flex-wrap justify-center gap-3 mb-8'>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all ${
                selectedFilter === category
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className='bg-emerald-50 rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer'
            >
              
              <div className='relative h-64 overflow-hidden bg-white'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                />
                
                <div className='absolute top-3 left-3'>
                  <span className='bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-medium'>
                    {product.category}
                  </span>
                </div>
              </div>

              
              <div className='p-4'>
                <h3 className='font-semibold text-lg text-gray-800 mb-2 line-clamp-1'>
                  {product.name}
                </h3>

                <div className='flex items-center gap-1 mb-3'>
                  <div className='flex text-yellow-400'>
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(product.rating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className='text-sm text-gray-600 ml-1'>
                    ({product.rating})
                  </span>
                </div>

                
                <div className='flex items-center justify-between'>
                  <span className='text-2xl font-bold text-emerald-600'>
                    ${product.price}
                  </span>
                  <button className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        {filteredProducts.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductShowcase;