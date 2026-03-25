import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '../../redux/reducer/Categoryslice'
import { Link } from 'react-router-dom'

const ProductCategory = () => {
  const dispatch = useDispatch()
  const { categories, loading } = useSelector((state) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // Filter only active categories
  const activeCategories = categories?.filter((cat) => cat.isActive) || []

  // Default category images - you can update these URLs
  const categoryImages = {
    'skin-care': 'https://i.pinimg.com/1200x/88/c1/e0/88c1e0c2a0ef5868acb778d2c24fdbfb.jpg',
    'hair-care': 'https://i.pinimg.com/1200x/04/55/d8/0455d84d63905fb0958ca01c5c28b4cb.jpg',
    'body-care': 'https://i.pinimg.com/736x/9f/ac/e5/9face50cd6e20d2a57d8aeea7dee96cf.jpg',
  }

  // Get image for category based on slug
  const getImageForCategory = (slug) => {
    return categoryImages[slug] || 'https://i.pinimg.com/1200x/88/c1/e0/88c1e0c2a0ef5868acb778d2c24fdbfb.jpg'
  }

  if (loading) {
    return (
      <div className='w-full p-4 sm:p-6 md:p-8'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800'>
            Shop by Category
          </h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-80 bg-gray-200 rounded-lg animate-pulse'></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!activeCategories || activeCategories.length === 0) {
    return (
      <div className='w-full p-4 sm:p-6 md:p-8'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800'>
            Shop by Category
          </h1>
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No categories available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full p-4 sm:p-6 md:p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800'>
          Shop by Category
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8'>
          {activeCategories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className='group'
            >
              <div
                className='bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden'
              >
                <div className='relative h-64 overflow-hidden'>
                  <img
                    src={getImageForCategory(category.slug)}
                    alt={category.name}
                    className='w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'></div>
                  
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductCategory