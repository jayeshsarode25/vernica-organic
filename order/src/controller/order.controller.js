import { validationResult } from "express-validator";
import orderModel from "../model/order.model.js";
import axios from "axios";
import { AppError, catchAsync } from "../utils/error.utils.js"; // ✅

// ─────────────────────────────────────────────────────────────────
// CREATE ORDER
// ─────────────────────────────────────────────────────────────────
export const createOrder = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }

  const userId = req.user.userId;
  const token  = req.cookies?.token;

  // fetch cart
  const cartResponse = await axios.get(`http://localhost:3003/api/cart/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const cart = cartResponse.data.cart;

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  // fetch all products in parallel
  const products = await Promise.all(
    cart.items.map(async (item) => {
      const productId      = item.productId?._id || item.productId;
      const productResponse = await axios.get(
        `http://localhost:3002/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return productResponse.data.data;
    })
  );

  // build order items + calculate total
  let totalAmount = 0;

  const orderItems = cart.items.map((item) => {
    const productId = item.productId?._id || item.productId;
    const product   = products.find(
      (p) => p._id.toString() === productId.toString()
    );

    if (!product) {
      throw new AppError(`Product not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`${product.title} is out of stock`, 409);
    }

    const itemTotal = Number(product.price.amount) * Number(item.quantity);
    totalAmount    += itemTotal;

    return {
      productId,
      quantity: item.quantity,
      price: {
        amount:   itemTotal,
        currency: product.price.currency || "INR",
      },
    };
  });

  const order = await orderModel.create({
    user:            userId,
    items:           orderItems,
    status:          "PENDING",
    totalPrice:      { amount: totalAmount, currency: "INR" },
    shippingAddress: req.body.shippingAddress,
  });

  res.status(201).json({ message: "Order created successfully", order });
});

// ─────────────────────────────────────────────────────────────────
// GET MY ORDERS
// ─────────────────────────────────────────────────────────────────
export const getMyOrder = catchAsync(async (req, res) => {
  const userId   = req.user.userId;
  const page     = parseInt(req.query.page)  || 1;
  const limit    = parseInt(req.query.limit) || 10;
  const skip     = (page - 1) * limit;

  const [order, totalOrder] = await Promise.all([
    orderModel.find({ user: userId }).skip(skip).limit(limit).exec(),
    orderModel.countDocuments({ user: userId }),
  ]);

  res.status(200).json({
    order,
    meta: { total: totalOrder, page, limit },
  });
});

// ─────────────────────────────────────────────────────────────────
// GET ORDER BY ID
// ─────────────────────────────────────────────────────────────────
export const getOrderById = catchAsync(async (req, res) => {
  const userId  = req.user.userId;
  const orderId = req.params.id;

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.user.toString() !== userId) {
    throw new AppError("Forbidden", 403);
  }

  res.status(200).json({ order });
});

// ─────────────────────────────────────────────────────────────────
// CANCEL ORDER
// ─────────────────────────────────────────────────────────────────
export const cancelOrder = catchAsync(async (req, res) => {
  const userId  = req.user.userId;
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
  const userId  = req.user.userId;
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
        { $unwind: "$item" },
        { $group: { _id: "$item.product", sold: { $sum: "$item.quantity" } } },
        { $sort: { sold: -1 } },
        { $limit: 5 },
      ]),
    ]);

  res.json({
    totalOrders,
    totalRevenue:  revenueData[0]?.total || 0,
    ordersByStatus,
    topProduct,
  });
});

// ─────────────────────────────────────────────────────────────────
// ADMIN — UPDATE ORDER STATUS
// ─────────────────────────────────────────────────────────────────
export const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const orderId    = req.params.id;

  const allowedStatus = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!allowedStatus.includes(status)) {
    throw new AppError("Invalid status value", 400);
  }

  const order = await orderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
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
    page      = 1,
    limit     = 10,
    status,
    search,
    startDate,
    endDate,
    sort      = "desc",
  } = req.query;

  const pageNum  = Number(page);
  const limitNum = Number(limit);

  const filter = {};

  if (status) filter.status = status;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate)   filter.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    const users = await userModel
      .find({
        $or: [
          { name:  { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      })
      .select("_id")
      .lean();

    const userIds = users.map((u) => u._id);

    filter.$or = /^[0-9a-fA-F]{24}$/.test(search)
      ? [{ user: { $in: userIds } }, { _id: search }]
      : [{ user: { $in: userIds } }];
  }

  const [orders, totalOrders] = await Promise.all([
    orderModel
      .find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    orderModel.countDocuments(filter),
  ]);

  res.json({
    success:    true,
    page:       pageNum,
    totalPages: Math.ceil(totalOrders / limitNum),
    totalOrders,
    data:       orders,
  });
});