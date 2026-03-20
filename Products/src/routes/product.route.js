import express from "express";
import upload from "../middleware/multer.js";
import * as productCrontroller from "../controller/product.controller.js";
import {
  createProductValidators,
  updateProductValidators,
} from "../middleware/product.middleware.js";
import createAuthMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

//Admin api

router.post(
  "/",
  createAuthMiddleware(["admin"]),
  upload.fields([
    { name: "imagesUrls", maxCount: 2 },
    { name: "videoUrl", maxCount: 1 },
  ]),
  createProductValidators, // ⭐ WITH CATEGORY VALIDATION
  productCrontroller.createProduct,
);

// Update product
router.patch(
  "/:id",
  createAuthMiddleware(["admin"]),
  updateProductValidators, // ⭐ WITH CATEGORY VALIDATION
  productCrontroller.updateProduct,
);

// Delete product
router.delete(
  "/:id",
  createAuthMiddleware(["admin"]),
  productCrontroller.deleteProduct,
);

// Get product count (with category breakdown)
router.get(
  "/count",
  createAuthMiddleware(["admin"]),
  productCrontroller.getProductCount,
);

// ====================================
// PUBLIC ROUTES
// ====================================

// Get all products with optional filters by category, price, search
router.get("/", productCrontroller.getProduct);

router.get("/category/:categoryId", productCrontroller.getProductsByCategory);

router.get(
  "/category-slug/:slug",
  productCrontroller.getProductsByCategorySlug,
);

router.get("/:id", productCrontroller.getProductById);

export default router;
