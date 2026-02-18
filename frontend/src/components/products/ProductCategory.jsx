import React from 'react'
import { useState } from 'react';

const ProductCategory = () => {
  const categories = [
    {
      id: 1,
      name: 'Skin Care',
      image: 'https://i.pinimg.com/1200x/88/c1/e0/88c1e0c2a0ef5868acb778d2c24fdbfb.jpg',
      description: 'Nourish and protect your skin'
    },
    {
      id: 2,
      name: 'Hair Care',
      image: 'https://i.pinimg.com/1200x/04/55/d8/0455d84d63905fb0958ca01c5c28b4cb.jpg',
      description: 'Healthy and beautiful hair'
    },
    {
      id: 3,
      name: 'Body Care',
      image: 'https://i.pinimg.com/736x/9f/ac/e5/9face50cd6e20d2a57d8aeea7dee96cf.jpg',
      description: 'Complete body wellness'
    }
  ];

  return (
    <div className='w-full p-4 sm:p-6 md:p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800'>
          Shop by Category
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8'>
          {categories.map((category) => (
            <div
              key={category.id}
              className='bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group'
            >
              <div className='relative h-64 overflow-hidden'>
                <img
                  src={category.image}
                  alt={category.name}
                  className='w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent'></div>
                
                <div className='absolute bottom-0 left-0 right-0 p-6'>
                  <h3 className='text-2xl md:text-3xl font-bold text-white mb-2'>
                    {category.name}
                  </h3>
                  <p className='text-white/90 text-sm md:text-base'>
                    {category.description}
                  </p>
                </div>
              </div>

              <div className='bg-emerald-600 group-hover:bg-emerald-700 text-white py-3 text-center font-medium transition-colors'>
                Shop Now →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory