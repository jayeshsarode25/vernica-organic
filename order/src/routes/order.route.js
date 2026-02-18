import express from "express";
import authMiddleware from "../middleware/auth.middelware.js";
import * as validate from "../middleware/order.middleware.js";
import * as orderController from "../controller/order.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware(["user"]),
  validate.createOrderValidation,
  orderController.createOrder,
);

router.get("/me", authMiddleware(["user"]), orderController.getMyOrder);

router.post(
  "/:id/cancel",
  authMiddleware(["user"]),
  orderController.cancelOrder,
);

router.patch(
  "/:id/address",
  authMiddleware(["user"]),
  validate.updateAddressValidation,
  orderController.updateOrderAddress,
);

// admin routes

router.get(
  "/dashbord",
  authMiddleware(["admin"]),
  orderController.getOrderDashboard,
);

router.get("/all_orders", authMiddleware(["admin"]), orderController.getAllOrders);

router.patch(
  "/:id",
  authMiddleware(["admin"]),
  orderController.updateOrderStatus,
);

router.get(
  "/:id",
  authMiddleware(["user", "admin"]),
  orderController.getOrderById,
);

export default router;
