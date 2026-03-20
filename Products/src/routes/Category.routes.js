import express from "express";
import * as categoryController from "../controller/Category.controller.js";
import createAuthMiddleware from "../middleware/auth.middleware.js";
import { createCategoryValidators, updateCategoryValidators } from "../middleware/product.middleware.js";

const router = express.Router();

// ====================================
// PUBLIC ROUTES
// ====================================

// Get all active categories
router.get("/", categoryController.getCategories);
 
// Get category by ID
router.get("/:id", categoryController.getCategoryById);
 
// Get category by slug (for product page URLs)
router.get("/slug/:slug", categoryController.getCategoryBySlug);
 
// ====================================
// ADMIN ROUTES
// ====================================
 
// Create new category
router.post(
  "/",
  createAuthMiddleware(["admin"]),
  createCategoryValidators, // ⭐ WITH VALIDATORS
  categoryController.createCategory
);
 
// Update category
router.put(
  "/:id",
  createAuthMiddleware(["admin"]),
  updateCategoryValidators, // ⭐ WITH VALIDATORS
  categoryController.updateCategory
);
 
// Delete category
router.delete(
  "/:id",
  createAuthMiddleware(["admin"]),
  categoryController.deleteCategory
);

export default router;