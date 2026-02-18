import express from "express";
import * as adminController from "../controller/admin.controller.js";
import createAuthMiddleware from "../middleware/auth.middelware.js";
import * as orderController from "../controller/order.controller.js";
import * as userController from "../controller/user.controller.js";

const router = express.Router();

// admin panel routes

router.get(
  "/metrics",
  createAuthMiddleware(["admin"]),
  adminController.getDashbordMetries,
);

//order routes

router.get(
  "/orders",
  createAuthMiddleware(["admin"]),
  orderController.getAllOrders,
);

router.get(
  "/:id",
  createAuthMiddleware(["admin"]),
  orderController.getOrderById,
);
router.patch(
  "/:id",
  createAuthMiddleware(["admin"]),
  orderController.updateOrderStatus,
);

// user routes

router.get("/users", createAuthMiddleware(["admin"]), userController.getUser);

router.get(
  "/users/:id",
  createAuthMiddleware(["admin"]),
  userController.getUserById,
);

router.delete(
  "/users/:id",
  createAuthMiddleware(["admin"]),
  userController.deleteUser,
);

router.patch(
  "/users/:id/block",
  createAuthMiddleware(["admin"]),
  userController.blockUser,
);

export default router;
