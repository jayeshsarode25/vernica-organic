import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
      minlength: [5, "Title must be at least 5 characters"],
    },
    
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      // Auto-generated from title
    },
    
    description: {
      type: String,
      required: [true, "Blog description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
      minlength: [20, "Description must be at least 20 characters"],
    },
    
    content: {
      type: String,
      required: [true, "Blog content is required"],
      minlength: [100, "Content must be at least 100 characters"],
      // Can store rich HTML from editor
    },
    
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [50, "Author name cannot exceed 50 characters"],
    },
    
    thumbnail: {
      type: String,
      required: [true, "Thumbnail image is required"],
      // Store image URL
    },
    
    category: {
      type: String,
      required: [true, "Blog category is required"],
      enum: [
        "Beauty Tips",
        "Skincare",
        "Haircare",
        "Wellness",
        "Trending",
        "Tutorials",
        "Reviews",
        "News",
      ],
    },
    
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        // e.g., ["skincare", "natural", "organic"]
      },
    ],
    
    isPublished: {
      type: Boolean,
      default: false,
      // Draft (false) or Published (true)
    },
    
    viewCount: {
      type: Number,
      default: 0,
      // Increments when user views blog
    },
    
    isActive: {
      type: Boolean,
      default: true,
      // Can disable without deleting
    },
    
    metaTitle: {
      type: String,
      maxlength: [60, "Meta title cannot exceed 60 characters"],
      // For SEO
    },
    
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
      // For SEO
    },
    
    metaKeywords: [String],
    // For SEO
    
    readingTime: {
      type: Number,
      // Calculated: ~200 words per minute
    },
  },
  { timestamps: true }
);

// ✅ Index for faster queries
blogSchema.index({ slug: 1 });
blogSchema.index({ isPublished: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ tags: 1 });

// ✅ Generate slug from title before saving
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // ✅ Calculate reading time (approx 200 words/minute)
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  next();
});

const blogModel = mongoose.model("blog", blogSchema);

export default blogModel;