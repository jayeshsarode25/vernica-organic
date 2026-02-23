import React from 'react'

const ProductLoader = () => {
  return (
    <div className="animate-pulse border rounded-xl p-3">
      <div className="bg-gray-300 h-52 rounded"></div>
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  )
}

export default ProductLoader