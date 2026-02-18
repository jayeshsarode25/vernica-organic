import express from "express";
import upload from "../middleware/multer.js";
import * as productCrontroller from "../controller/product.controller.js";
import createProductValidators from '../middleware/product.middleware.js'
import createAuthMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

//Admin api

router.post(
  "/",
  createAuthMiddleware(["admin"]),
  upload.fields([
    { name: "images", maxCount: 2 },
    { name: "video", maxCount: 1 },
  ]),
  createProductValidators,
  productCrontroller.createProduct
);

router.patch('/:id', createAuthMiddleware(["admin"]), productCrontroller.updateProduct);

router.delete('/:id', createAuthMiddleware(["admin"]), productCrontroller.deleteProduct);

//Products api

router.get('/', productCrontroller.getProduct);

router.get('/count', productCrontroller.getProductCount);

router.get('/:id', productCrontroller.getProductById);


export default router;
