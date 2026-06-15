import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const BlogForm = ({ blog, categories, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    author: '',
    thumbnail: '',
    category: '',
    tags: [],
    isPublished: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
  })

  const [tagInput, setTagInput] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        description: blog.description,
        content: blog.content,
        author: blog.author,
        thumbnail: blog.thumbnail,
        category: blog.category,
        tags: blog.tags || [],
        isPublished: blog.isPublished,
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        metaKeywords: blog.metaKeywords || [],
      })
    }
  }, [blog])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    } else if (formData.title.length > 150) {
      newErrors.title = 'Title cannot exceed 150 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters'
    }

    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      newErrors.content = 'Content is required'
    } else if (formData.content.length < 100) {
      newErrors.content = 'Content must be at least 100 characters'
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required'
    } else if (formData.author.length > 50) {
      newErrors.author = 'Author name cannot exceed 50 characters'
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = 'Thumbnail image URL is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value })
    if (errors.content) {
      setErrors({ ...errors, content: '' })
    }
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (tagInput.trim() && !formData.tags.includes(tagInput.toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.toLowerCase()],
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleAddKeyword = (e) => {
    e.preventDefault()
    if (keywordInput.trim() && !formData.metaKeywords.includes(keywordInput.toLowerCase())) {
      setFormData({
        ...formData,
        metaKeywords: [...formData.metaKeywords, keywordInput.toLowerCase()],
      })
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keywordToRemove) => {
    setFormData({
      ...formData,
      metaKeywords: formData.metaKeywords.filter((kw) => kw !== keywordToRemove),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {blog ? 'Edit Blog' : 'Create New Blog'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              } focus:ring-2 focus:outline-none`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/150</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter blog description (short summary)"
              rows="3"
              className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              } focus:ring-2 focus:outline-none`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blog Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(event) => handleContentChange(event.target.value)}
              placeholder="Write your blog content here..."
              rows={12}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-y ${
                errors.content
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              } focus:ring-2 focus:outline-none`}
            />
            {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author Name *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Enter author name"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                errors.author
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              } focus:ring-2 focus:outline-none`}
            />
            {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author}</p>}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail Image URL *
            </label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                errors.thumbnail
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              } focus:ring-2 focus:outline-none`}
            />
            {errors.thumbnail && <p className="text-red-600 text-sm mt-1">{errors.thumbnail}</p>}
            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt="Thumbnail preview"
                loading="lazy"
                className="mt-2 w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                errors.category
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              } focus:ring-2 focus:outline-none`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Fields</h3>

            <div className="space-y-4">
              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO title"
                  maxLength="60"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60</p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="SEO description"
                  maxLength="160"
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160
                </p>
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add a keyword"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword(e)}
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.metaKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Publish Status */}
          <div className="border-t pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-gray-700 font-medium">Publish this blog</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              {formData.isPublished
                ? 'This blog will be visible on the website'
                : 'This blog will be saved as draft'}
            </p>
          </div>

          {/* Actions */}
          <div className="border-t pt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlogForm
