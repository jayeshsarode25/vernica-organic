import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
  clearSuccess,
} from '../../redux/reducer/Categoryslice';
import CategoryCard from '../../components/categories/CategoryCard';
import CategoryForm from '../../components/categories/CategoryForm';
 
const CategoryManagement = () => {
  const dispatch = useDispatch();
  const {
    categories,
    loading,
    error,
    success,
    successMessage,
  } = useSelector((state) => state.categories);
 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
 
  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
 
  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);
 
  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const handleOpenForm = (category = null) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };
 
  const handleCloseForm = () => {
    setEditingCategory(null);
    setIsFormOpen(false);
  };
 
  const handleSubmit = async (formData) => {
    if (editingCategory) {
      // Update
      await dispatch(updateCategory({
        id: editingCategory._id,
        categoryData: formData,
      }));
    } else {
      // Create
      await dispatch(createCategory(formData));
    }
    handleCloseForm();
  };
 
  const handleDelete = async (id) => {
    await dispatch(deleteCategory(id));
    setDeleteConfirm(null);
  };
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Category Management
          </h1>
          <p className="text-gray-600">
            Manage your product categories here
          </p>
        </div>
 
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">{successMessage}</p>
            </div>
          </div>
        )}
 
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900">{error}</p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Dismiss
            </button>
          </div>
        )}
 
        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
 
          {/* View Toggle & Create Button */}
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 font-medium transition-colors ${
                  view === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                List
              </button>
            </div>
 
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              <Plus size={20} />
              New Category
            </button>
          </div>
        </div>
 
        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
 
        {!loading && filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No categories found</p>
            <button
              onClick={() => handleOpenForm()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Create First Category
            </button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {view === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    onEdit={handleOpenForm}
                    onDelete={() => setDeleteConfirm(category._id)}
                    variant="grid"
                  />
                ))}
              </div>
            )}
 
            {/* List View */}
            {view === 'list' && (
              <div className="space-y-4">
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    onEdit={handleOpenForm}
                    onDelete={() => setDeleteConfirm(category._id)}
                    variant="list"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
 
      {/* Category Form Modal */}
      {isFormOpen && (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
          loading={loading}
        />
      )}
 
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Category?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to delete this category?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default CategoryManagement;
