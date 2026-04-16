import React, { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getBlogBySlug, getRelatedBlogs } from '../redux/slices/blogSlice'
import { Calendar, User, Eye, Share2, ArrowLeft } from 'lucide-react'

const BlogDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedBlog, relatedBlogs, loading } = useSelector(
    (state) => state.blogs
  )

  useEffect(() => {
    if (slug) {
      dispatch(getBlogBySlug(slug))
    }
  }, [slug, dispatch])

  useEffect(() => {
    if (selectedBlog?._id) {
      dispatch(getRelatedBlogs(selectedBlog._id))
    }
  }, [selectedBlog?._id, dispatch])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin">
          <div className="border-4 border-gray-300 border-t-green-600 rounded-full w-12 h-12" />
        </div>
      </div>
    )
  }

  if (!selectedBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <Link
            to="/blogs"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  const handleShare = () => {
    const url = window.location.href
    const text = `Check out this blog: ${selectedBlog.title}`

    if (navigator.share) {
      navigator.share({
        title: selectedBlog.title,
        text: selectedBlog.description,
        url: url,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert('Blog URL copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <img
            src={selectedBlog.thumbnail}
            alt={selectedBlog.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Category Badge */}
        <span className="inline-block px-4 py-1 bg-green-100 text-green-700 font-semibold rounded-full mb-4">
          {selectedBlog.category}
        </span>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {selectedBlog.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-6 text-gray-600 mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <User size={18} />
            <span>{selectedBlog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>{new Date(selectedBlog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={18} />
            <span>{selectedBlog.viewCount} views</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{selectedBlog.readingTime} min read</span>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 mb-8 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
        >
          <Share2 size={18} />
          Share
        </button>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
          />
        </div>

        {/* Tags */}
        {selectedBlog.tags && selectedBlog.tags.length > 0 && (
          <div className="mb-12 pb-12 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {selectedBlog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blogs?tag=${tag}`}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="bg-green-50 rounded-lg p-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h3>
          <p className="text-gray-700">{selectedBlog.author}</p>
        </div>
      </article>

      {/* Related Blogs */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className="bg-white py-12 border-t">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-4">
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                      {blog.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-green-600 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {blog.description}
                    </p>
                    <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                      <span>{blog.author}</span>
                      <span>{blog.readingTime} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default BlogDetail