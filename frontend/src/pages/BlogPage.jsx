import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllBlogs, getBlogCategories, getBlogTags } from '../redux/reducer/Blogslice'
import { Link } from 'react-router-dom'
import { Search, Calendar, User, Eye } from 'lucide-react'

const BlogPage = () => {
  const dispatch = useDispatch()
  const { blogs, categories, tags, loading, pagination } = useSelector(
    (state) => state.blogs
  )

  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Fetch blogs on mount and when filters change
  useEffect(() => {
    dispatch(getAllBlogs({ page, limit: 10, category, tag, search }))
  }, [page, category, tag, search, dispatch])

  // Fetch categories and tags on mount
  useEffect(() => {
    dispatch(getBlogCategories())
    dispatch(getBlogTags())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleCategoryFilter = (cat) => {
    setCategory(cat === category ? '' : cat)
    setPage(1)
  }

  const handleTagFilter = (t) => {
    setTag(t === tag ? '' : t)
    setPage(1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < pagination.pages) setPage(page + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-green-200 to-green-300 text-black py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Beauty & Wellness Blog</h1>
          <p className="text-lg text-black">Discover tips, trends, and expert advice</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                    !category
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryFilter(cat)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      category === cat
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tagObj) => (
                  <button
                    key={tagObj._id}
                    onClick={() => handleTagFilter(tagObj._id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      tag === tagObj._id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tagObj._id} ({tagObj.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin">
                  <div className="border-4 border-gray-300 border-t-green-600 rounded-full w-12 h-12" />
                </div>
              </div>
            )}

            {/* Blog List */}
            {!loading && blogs.length > 0 && (
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                      {/* Thumbnail */}
                      <div className="md:col-span-1">
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          loading="lazy"
                          className="w-full h-48 md:h-40 object-cover rounded-lg"
                        />
                      </div>

                      {/* Content */}
                      <div className="md:col-span-3">
                        {/* Category Badge */}
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-2">
                          {blog.category}
                        </span>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-green-600">
                          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 line-clamp-2">{blog.description}</p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <User size={16} />
                            {blog.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={16} />
                            {blog.viewCount} views
                          </div>
                          <div className="text-gray-500">
                            {blog.readingTime} min read
                          </div>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Read More Button */}
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && blogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No blogs found. Try different filters!</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && blogs.length > 0 && pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
                >
                  ← Previous
                </button>

                <div className="text-gray-600">
                  Page {pagination.currentPage} of {pagination.pages}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={page >= pagination.pages}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
