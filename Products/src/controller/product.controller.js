import mongoose from "mongoose";
import productModel from "../model/product.model.js";
import categoryModel from "../model/category.model.js";
import { uploadImage, uploadVideo } from "../services/imagekit.services.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, priceAmount, priceCurrency = "INR", categoryId, rating = 0, stock = 0 } = req.body;
 
    
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
 
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }
 
    const categoryExists = await categoryModel.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }
 
    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency,
    };
 
    let imageUrls = [];
    console.log(req.files);
 
    if (req.files?.imagesUrls?.length) {
      imageUrls = await Promise.all(
        req.files.imagesUrls.map(async (file) => {
          const uploaded = await uploadImage({
            buffer: file.buffer,
            folder: "products/images",
          });
          return { url: uploaded.url };
        })
      );
    }
 
    let videoUrl = "";
 
    if (req.files?.videoUrl) {
      const file = req.files.videoUrl[0];
      const video = await uploadVideo({
        buffer: file.buffer,
        originalname: file.originalname,
        folder: "products/videos",
      });
      videoUrl = {
        url: video.url,
        thumbnail: video.thumbnail,
        id: video.id,
      };
    }
 
    const product = await productModel.create({
      title,
      description,
      price,
      images: imageUrls,
      video: videoUrl,
      categoryId, // ⭐ NEW: Add category
      rating,
      stock,
    });
 
    // ⭐ NEW: Update category product count
    await categoryModel.findByIdAndUpdate(
      categoryId,
      { $inc: { productCount: 1 } },
      { new: true }
    );
 
    // ⭐ NEW: Populate category in response
    const populatedProduct = await product.populate("categoryId", "name slug description");
 
    res.status(201).json({
      message: "Product created Successfully",
      data: populatedProduct,
    });
  } catch (error) {
    console.error("UPLOAD ERROR", error);
    res.status(500).json({ message: "Failed to Upload", error: error.message });
  }
};
 
export const updateProduct = async (req, res) => {
  const { id } = req.params;
 
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }
 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product Id" });
  }
 
  const product = await productModel.findOne({
    _id: id,
  });
 
  if (!product) {
    return res.status(404).json({ message: "Product Not Found" });
  }
 
  // ⭐ NEW: Allow category update
  const allowUpdates = ["title", "description", "price", "categoryId", "rating", "stock", "isActive"];
 
  for (const key of Object.keys(req.body || {})) {
    if (allowUpdates.includes(key)) {
      // If updating category, validate it exists and update counts
      if (key === "categoryId") {
        if (!mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
          return res.status(400).json({ message: "Invalid Category ID" });
        }
 
        const newCategory = await categoryModel.findById(req.body.categoryId);
        if (!newCategory) {
          return res.status(404).json({ message: "New category not found" });
        }
 
        // Update counts for both old and new categories
        await categoryModel.findByIdAndUpdate(product.categoryId, { $inc: { productCount: -1 } });
        await categoryModel.findByIdAndUpdate(req.body.categoryId, { $inc: { productCount: 1 } });
 
        product[key] = req.body[key];
      } else if (key === "price" && typeof req.body.price === "object") {
        if (req.body.price.amount !== undefined) {
          product.price.amount = Number(req.body.price.amount);
        }
        if (req.body.price.currency !== undefined) {
          product.price.currency = req.body.price.currency;
        }
      } else {
        product[key] = req.body[key];
      }
    }
  }
 
  await product.save();
 
  // ⭐ NEW: Populate category in response
  const updatedProduct = await product.populate("categoryId", "name slug description");
 
  return res.status(200).json({ message: "Product Update Successfully", product: updatedProduct });
};
 
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product Id" });
  }
 
  const product = await productModel.findOne({
    _id: id,
  });
 
  if (!product) {
    return res.status(404).json({ message: "Product Not Found" });
  }
 
  await productModel.findOneAndDelete({ _id: id });
 
  // ⭐ NEW: Update category product count
  await categoryModel.findByIdAndUpdate(
    product.categoryId,
    { $inc: { productCount: -1 } },
    { new: true }
  );
 
  return res.status(200).json({ message: "Product Deleted Successfully" });
};
 
export const getProduct = async (req, res) => {
  const { q, skip = 0, limit = 10 } = req.query;
 
  const minPriceRaw = req.query.minprice ?? req.query.minPrice;
  const maxPriceRaw = req.query.maxprice ?? req.query.maxPrice;
 
  // ⭐ NEW: Category filter
  const categoryId = req.query.categoryId;
  const categorySlug = req.query.categorySlug;
 
  const filter = { isActive: true }; // Only active products
 
  if (q) {
    filter.$text = { $search: q };
  }
 
  if (minPriceRaw !== undefined) {
    const min = Number(minPriceRaw);
    if (!Number.isNaN(min)) {
      filter["price.amount"] = { ...(filter["price.amount"] || {}), $gte: min };
    }
  }
 
  if (maxPriceRaw !== undefined) {
    const max = Number(maxPriceRaw);
    if (!Number.isNaN(max)) {
      filter["price.amount"] = { ...(filter["price.amount"] || {}), $lte: max };
    }
  }
 
  // ⭐ NEW: Filter by category ID
  if (categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }
    filter.categoryId = new mongoose.Types.ObjectId(categoryId);
  }
 
  // ⭐ NEW: Filter by category slug
  if (categorySlug) {
    const category = await categoryModel.findOne({ slug: categorySlug, isActive: true });
    if (category) {
      filter.categoryId = category._id;
    }
  }
 
  const products = await productModel
    .find(filter)
    .populate("categoryId", "name slug description") // ⭐ NEW: Populate category
    .skip(Number(skip))
    .limit(Math.min(Number(limit), 50)) // Increased max limit to 50
    .sort({ createdAt: -1 }); // Sort by newest first
 
  const totalCount = await productModel.countDocuments(filter);
 
  return res.status(200).json({
    message: "Products Fetched Successfully",
    pagination: {
      skip: Number(skip),
      limit: Math.min(Number(limit), 50),
      total: totalCount,
    },
    data: products,
  });
};
 
export const getProductById = async (req, res) => {
  const { id } = req.params;
 
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }
 
    const product = await productModel
      .findById(id)
      .populate("categoryId", "name slug description"); // ⭐ NEW: Populate category
 
    if (!product) {
      return res.status(404).json({ message: "Product not Found" });
    }
 
    return res.status(200).json({ data: product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
 
export const getProductCount = async (req, res) => {
  try {
    const totalProducts = await productModel.countDocuments({ isActive: true });
 
    // ⭐ NEW: Get count by category
    const countByCategory = await productModel.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
    ]);
 
    res.json({
      totalProducts,
      countByCategory: countByCategory.map((item) => ({
        categoryId: item._id,
        categoryName: item.category[0]?.name,
        count: item.count,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// ⭐ NEW: Get products by category with pagination and sorting
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { skip = 0, limit = 12, sort = "newest" } = req.query;
 
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }
 
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
 
    // Build sort object
    let sortObj = { createdAt: -1 }; // default: newest
    if (sort === "price_asc") sortObj = { "price.amount": 1 };
    if (sort === "price_desc") sortObj = { "price.amount": -1 };
    if (sort === "rating") sortObj = { rating: -1 };
 
    const products = await productModel
      .find({ categoryId, isActive: true })
      .populate("categoryId", "name slug description")
      .sort(sortObj)
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 50));
 
    const totalCount = await productModel.countDocuments({ categoryId, isActive: true });
 
    res.json({
      message: "Products retrieved successfully",
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      pagination: {
        skip: Number(skip),
        limit: Math.min(Number(limit), 50),
        total: totalCount,
        pages: Math.ceil(totalCount / Math.min(Number(limit), 50)),
      },
      sort,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
// ⭐ NEW: Get products by category slug
export const getProductsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { skip = 0, limit = 12, sort = "newest" } = req.query;
 
    const category = await categoryModel.findOne({ slug, isActive: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
 
    // Build sort object
    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { "price.amount": 1 };
    if (sort === "price_desc") sortObj = { "price.amount": -1 };
    if (sort === "rating") sortObj = { rating: -1 };
 
    const products = await productModel
      .find({ categoryId: category._id, isActive: true })
      .populate("categoryId", "name slug description")
      .sort(sortObj)
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 50));
 
    const totalCount = await productModel.countDocuments({ categoryId: category._id, isActive: true });
 
    res.json({
      message: "Products retrieved successfully",
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      pagination: {
        skip: Number(skip),
        limit: Math.min(Number(limit), 50),
        total: totalCount,
        pages: Math.ceil(totalCount / Math.min(Number(limit), 50)),
      },
      sort,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get products by category slug error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};