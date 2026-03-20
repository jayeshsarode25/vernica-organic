import { body, validationResult } from "express-validator";
import categoryModel from "../model/category.model.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  next();
}

const createProductValidators = [
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("title is required"),

  body("description")
    .optional()
    .isString()
    .withMessage("description must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("description max length is 500 characters"),

  body("priceAmount")
    .notEmpty()
    .withMessage("priceAmount is required")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("priceAmount must be a number > 0"),

  body("priceCurrency")
    .optional()
    .isIn(["USD", "INR"])
    .withMessage("priceCurrency must be USD or INR"),

  // ⭐ CATEGORY VALIDATION (FIXED ES6 IMPORT)
  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is required")
    .bail()
    .isMongoId()
    .withMessage("categoryId must be a valid MongoDB ID")
    .bail()
    .custom(async (categoryId) => {
      // ⭐ FIXED: Using ES6 import at top instead of require()
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        throw new Error("Category does not exist");
      }
      if (!category.isActive) {
        throw new Error("Category is not active");
      }
    }),

  // ⭐ RATING VALIDATION
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("rating must be between 0 and 5"),

  // ⭐ STOCK VALIDATION
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("stock must be a non-negative integer"),

  handleValidationErrors,
];

// ⭐ UPDATE PRODUCT VALIDATORS
const updateProductValidators = [
  body("title")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty"),

  body("description")
    .optional()
    .isString()
    .withMessage("description must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("description max length is 500 characters"),

  body("priceAmount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("priceAmount must be a number > 0"),

  body("priceCurrency")
    .optional()
    .isIn(["USD", "INR"])
    .withMessage("priceCurrency must be USD or INR"),

  // ⭐ CATEGORY VALIDATION (FIXED ES6 IMPORT)
  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("categoryId must be a valid MongoDB ID")
    .bail()
    .custom(async (categoryId) => {
      // ⭐ FIXED: Using ES6 import at top
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        throw new Error("Category does not exist");
      }
      if (!category.isActive) {
        throw new Error("Category is not active");
      }
    }),

  // ⭐ RATING VALIDATION
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("rating must be between 0 and 5"),

  // ⭐ STOCK VALIDATION
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("stock must be a non-negative integer"),

  // ⭐ isActive VALIDATION
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  handleValidationErrors,
];

// ⭐ CREATE CATEGORY VALIDATORS
const createCategoryValidators = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("name must be between 3 and 50 characters"),

  body("description")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .bail()
    .isLength({ min: 10, max: 200 })
    .withMessage("description must be between 10 and 200 characters"),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("displayOrder must be a non-negative integer"),

  handleValidationErrors,
];

// ⭐ UPDATE CATEGORY VALIDATORS
const updateCategoryValidators = [
  body("name")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("name cannot be empty")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("name must be between 3 and 50 characters"),

  body("description")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("description cannot be empty")
    .bail()
    .isLength({ min: 10, max: 200 })
    .withMessage("description must be between 10 and 200 characters"),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("displayOrder must be a non-negative integer"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  handleValidationErrors,
];

export {
  createProductValidators,
  updateProductValidators,
  createCategoryValidators,
  updateCategoryValidators,
  handleValidationErrors,
};