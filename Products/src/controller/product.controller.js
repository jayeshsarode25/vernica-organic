import mongoose from "mongoose";
import productModel from "../model/product.model.js";
import { uploadImage, uploadVideo } from "../services/imagekit.services.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, priceAmount, priceCurrency = "INR" } = req.body;

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
        }),
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
    });

    res.status(201).json({
      message: "Product created Successfully",
      data: product,
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

  const allowUpdates = ["title", "description", "price"];
  for (const key of Object.keys(req.body || {})) {
    if (allowUpdates.includes(key)) {
      if (key === "price" && typeof req.body.price === "object") {
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
  return res
    .status(200)
    .json({ message: "Product Update Successfully", product });
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
  return res.status(200).json({ message: "Product Deleted Successfully" });
};

export const getProduct = async (req, res) => {
  const { q, skip = 0, limit = 10 } = req.query;

  const minPriceRaw = req.query.minprice ?? req.query.minPrice;
  const maxPriceRaw = req.query.maxprice ?? req.query.maxPrice;

  const filter = {};

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

  const products = await productModel
    .find(filter)
    .skip(Number(skip))
    .limit(Math.min(Number(limit), 10));

  return res.status(200).json({
    message: "Products Featch Successfully",
    data: products,
  });
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.findById(id);

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
    const totalProducts = await productModel.countDocuments();
    res.json({ totalProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
