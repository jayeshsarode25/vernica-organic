import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },
  },
  images: [
    {
      url: String,
      thumbnail: String,
      id: String,
    },
  ],
  video: {
    url: String,
    thumbnail: String,
    id: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
});

productSchema.index({ title: "text", description: "text" });

const productModel = mongoose.model("product", productSchema);

export default productModel;
