import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
  clearSuccess,
  clearError,
} from '../../redux/reducer/Blogslice'
import { Edit2, Trash2, Plus, Search, Eye, CheckCircle } from 'lucide-react'
import BlogForm from '../../components/admin/BlogForm'
import BlogCard from '../../components/admin/BlogCard'

const BlogManagement = () => {
  const dispatch = useDispatch()
  const {
    blogs,
    categories,
    loading,
    error,
    success,
    successMessage,
    pagination,
  } = useSelector((state) => state.blogs)

  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Fetch blogs on mount and when page changes
  useEffect(() => {
    dispatch(getAllBlogsAdmin({ page, limit: 10 }))
  }, [page, dispatch])

  // Fetch categories on mount
  useEffect(() => {
    dispatch(getBlogCategories())
  }, [dispatch])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleCreateBlog = () => {
    setEditingBlog(null)
    setShowForm(true)
  }

  const handleEditBlog = (blog) => {
    setEditingBlog(blog)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    if (editingBlog) {
      dispatch(updateBlog({ blogId: editingBlog._id, blogData: formData }))
    } else {
      dispatch(createBlog(formData))
    }
    setShowForm(false)
  }

  const handleDeleteBlog = (blogId) => {
    setDeleteConfirm(blogId)
  }

  const confirmDelete = (blogId) => {
    dispatch(deleteBlog(blogId))
    setDeleteConfirm(null)
  }

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < pagination.pages) setPage(page + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage your blog posts</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-green-900">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <div className="text-red-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-red-900">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Blog Form Modal */}
      {showForm && (
        <BlogForm
          blog={editingBlog}
          categories={categories}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
          loading={loading}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search blogs by title, description, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateBlog}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Plus size={20} />
                New Blog
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && !blogs.length && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin">
              <div className="border-4 border-gray-300 border-t-green-600 rounded-full w-12 h-12" />
            </div>
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onEdit={() => handleEditBlog(blog)}
                onDelete={() => handleDeleteBlog(blog._id)}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && viewMode === 'list' && (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {blog.description}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>By {blog.author}</span>
                        <span>{blog.category}</span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {blog.viewCount} views
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            blog.isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditBlog(blog)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit blog"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete blog"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === blog._id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Delete Blog?
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => confirmDelete(blog._id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBlogs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {blogs.length === 0 ? 'No Blogs Yet' : 'No Results Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {blogs.length === 0
                ? 'Start by creating your first blog post'
                : 'Try adjusting your search filters'}
            </p>
            {blogs.length === 0 && (
              <button
                onClick={handleCreateBlog}
                className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Plus size={20} />
                Create First Blog
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && blogs.length > 0 && pagination.pages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors font-medium"
            >
              ← Previous
            </button>

            <div className="text-gray-600 font-medium">
              Page {pagination.currentPage} of {pagination.pages}
            </div>

            <button
              onClick={handleNextPage}
              disabled={page >= pagination.pages}
              className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors font-medium"
            >
              Next →
            </button>
          </div>
        )}

        {/* Stats */}
        {!loading && blogs.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-gray-600 text-sm">Total Blogs</p>
              <p className="text-3xl font-bold text-gray-900">{pagination.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-gray-600 text-sm">Published</p>
              <p className="text-3xl font-bold text-green-600">
                {blogs.filter((b) => b.isPublished).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-gray-600 text-sm">Drafts</p>
              <p className="text-3xl font-bold text-yellow-600">
                {blogs.filter((b) => !b.isPublished).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-gray-600 text-sm">Total Views</p>
              <p className="text-3xl font-bold text-blue-600">
                {blogs.reduce((sum, b) => sum + (b.viewCount || 0), 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogManagement