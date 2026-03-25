    

import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';

const CategoryCard = ({ 
  category, 
  onEdit, 
  onDelete, 
  variant = 'default' 
}) => {
  if (variant === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group">
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-8 mb-4 group-hover:from-green-200 transition-colors">
          <h3 className="text-2xl font-bold text-green-900">
            {category.name.charAt(0).toUpperCase()}
          </h3>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {category.name}
        </h4>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {category.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {category.productCount} products
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            category.isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {category.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            {category.name}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{category.slug}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          category.isActive 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {category.description}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <span>{category.productCount} products</span>
        <span>Order: {category.displayOrder}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(category)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={() => onDelete(category._id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;