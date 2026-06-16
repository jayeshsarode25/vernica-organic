import { validationResult } from "express-validator";
import orderModel from "../model/order.model.js";
import axios from "axios";
import config from "../config/config.js";
import { AppError, catchAsync } from "../utils/error.utils.js"; // ✅

const fetchProductsByIds = async (productIds, token) => {
  const uniqueIds = [...new Set(productIds.filter(Boolean).map((id) => id.toString()))];

  const results = await Promise.allSettled(
    uniqueIds.map(async (productId) => {
      const response = await axios.get(`${config.PRODUCT_API_URL}/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data.data;
    }),
  );

  return results.reduce((map, result) => {
    if (result.status === "fulfilled" && result.value?._id) {
      map[result.value._id.toString()] = result.value;
    }
    return map;
  }, {});
};

const attachProductDetails = async (orders, token) => {
  const orderList = Array.isArray(orders) ? orders : [orders];
  const productIds = orderList.flatMap((order) =>
    (order.items || []).map((item) => item.productId?._id || item.productId),
  );
  const productsById = await fetchProductsByIds(productIds, token);

  const enrichedOrders = orderList.map((order) => ({
    ...order,
    items: (order.items || []).map((item) => {
      const productId = item.productId?._id || item.productId;
      const product = productsById[productId?.toString()];
      return product
        ? {
            ...item,
            productId: product,
            product,
            productName: product.title,
          }
        : item;
    }),
  }));

  return Array.isArray(orders) ? enrichedOrders : enrichedOrders[0];
};
// ─────────────────────────────────────────────────────────────────
// CREATE ORDER
// ─────────────────────────────────────────────────────────────────
export const createOrder = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }

  const userId = req.user.userId;
  const token = req.cookies?.token;

  // fetch cart
  const cartResponse = await axios.get(`${config.CART_API_URL}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const cart = cartResponse.data.cart;

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  // fetch all products in parallel
  const products = await Promise.all(
    cart.items.map(async (item) => {
      const productId = item.productId?._id || item.productId;
      const productResponse = await axios.get(
        `${config.PRODUCT_API_URL}/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return productResponse.data.data;
    }),
  );

  // build order items + calculate total
  let totalAmount = 0;

  const orderItems = cart.items.map((item) => {
    const productId = item.productId?._id || item.productId;
    const product = products.find(
      (p) => p._id.toString() === productId.toString(),
    );

    if (!product) {
      throw new AppError(`Product not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`${product.title} is out of stock`, 409);
    }

    const itemTotal = Number(product.price.amount) * Number(item.quantity);
    totalAmount += itemTotal;

    return {
      productId,
      quantity: item.quantity,
      price: {
        amount: itemTotal,
        currency: product.price.currency || "INR",
      },
    };
  });

  const discount = Number(req.body.discount) || 0;
  const discountedTotal = Math.max(totalAmount - discount, 0);
  const paymentMethod = req.body.paymentMethod === "COD" ? "COD" : "ONLINE";

  const order = await orderModel.create({
    user: userId,
    items: orderItems,
    status: "PENDING",
    totalPrice: { amount: discountedTotal, currency: "INR" },
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "COD_PENDING" : "PENDING",
    shippingAddress: req.body.shippingAddress,
  });

  const enrichedOrder = await attachProductDetails(order.toObject(), token);

  res.status(201).json({ message: "Order created successfully", order: enrichedOrder });
});

// ─────────────────────────────────────────────────────────────────
// GET MY ORDERS
// ─────────────────────────────────────────────────────────────────
export const getMyOrder = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [order, totalOrder] = await Promise.all([
    orderModel.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    orderModel.countDocuments({ user: userId }),
  ]);
  const enrichedOrders = await attachProductDetails(order, token);

  res.status(200).json({
    order: enrichedOrders,
    meta: { total: totalOrder, page, limit },
  });
});

// ─────────────────────────────────────────────────────────────────
// GET ORDER BY ID
// ─────────────────────────────────────────────────────────────────
export const getOrderById = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const orderId = req.params.id;
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  const order = await orderModel.findById(orderId).lean();

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (req.user.role !== "admin" && order.user.toString() !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const enrichedOrder = await attachProductDetails(order, token);

  res.status(200).json({ order: enrichedOrder });
});

// ─────────────────────────────────────────────────────────────────
// CANCEL ORDER
// ─────────────────────────────────────────────────────────────────
export const cancelOrder = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const orderId = req.params.id;

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.user.toString() !== userId) {
    throw new AppError("Forbidden", 403);
  }

  if (order.status !== "PENDING") {
    throw new AppError("Order cannot be cancelled at this stage", 409);
  }

  order.status = "CANCELLED";
  await order.save();

  res.status(200).json({ order });
});

// ─────────────────────────────────────────────────────────────────
// UPDATE ORDER ADDRESS
// ─────────────────────────────────────────────────────────────────
export const updateOrderAddress = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const orderId = req.params.id;

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.user.toString() !== userId) {
    throw new AppError("Forbidden: You do not have access to this order", 403);
  }

  if (order.status !== "PENDING") {
    throw new AppError("Order address cannot be updated at this stage", 409);
  }

  const { street, city, state, pincode, country } = req.body.shippingAddress;
  order.shippingAddress = { street, city, state, pincode, country };
  await order.save();

  res.status(200).json({ order });
});

// ─────────────────────────────────────────────────────────────────
// ADMIN — GET ORDER DASHBOARD
// ─────────────────────────────────────────────────────────────────
export const getOrderDashboard = catchAsync(async (req, res) => {
  const [totalOrders, revenueData, ordersByStatus, topProduct] =
    await Promise.all([
      orderModel.countDocuments(),

      orderModel.aggregate([
        { $match: { status: { $in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } } },
        { $group: { _id: null, total: { $sum: "$totalPrice.amount" } } },
      ]),

      orderModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      orderModel.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", sold: { $sum: "$items.quantity" } } },
        { $sort: { sold: -1 } },
        { $limit: 5 },
      ]),
    ]);

  res.json({
    totalOrders,
    totalRevenue: revenueData[0]?.total || 0,
    ordersByStatus,
    topProduct,
  });
});

// ─────────────────────────────────────────────────────────────────
// ADMIN — UPDATE ORDER STATUS
// ─────────────────────────────────────────────────────────────────
export const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  const allowedStatus = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!allowedStatus.includes(status)) {
    throw new AppError("Invalid status value", 400);
  }

  const order = await orderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  );

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  res.json({ message: "Order status updated", order });
});

// ─────────────────────────────────────────────────────────────────
// ADMIN — GET ALL ORDERS
// ─────────────────────────────────────────────────────────────────
export const getAllOrders = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    startDate,
    endDate,
    sort = "desc",
  } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const filter = {};

  if (status) filter.status = status;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  if (search && /^[0-9a-fA-F]{24}$/.test(search)) {
    filter.$or = [{ _id: search }, { user: search }];
  }

  const [orders, totalOrders] = await Promise.all([
    orderModel
      .find(filter)
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    orderModel.countDocuments(filter),
  ]);

  res.json({
    success: true,
    page: pageNum,
    totalPages: Math.ceil(totalOrders / limitNum),
    totalOrders,
    data: orders,
  });
});
