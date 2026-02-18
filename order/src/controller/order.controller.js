import orderModel from "../model/order.model.js";
import axios from "axios";

export const createOrder = async (req, res) => {
  const userId = req.user.userId;
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  try {
    const cartResponce = await axios.get(`http://localhost:3003/api/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cart = cartResponce.data.cart;

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const products = await Promise.all(
      cart.items.map(async (item) => {
        const productResponce = await axios.get(
          `http://localhost:3002/api/products/${item.productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return productResponce.data.data;
      }),
    );

    let totalAmount = 0;

    const orderItems = cart.items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString(),
      );

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        throw new Error(`${product.title} is out of stock`);
      }

      const itemTotal = Number(product.price.amount) * Number(item.quantity);

      totalAmount += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: {
          amount: itemTotal,
          currency: product.price.currency || "INR",
        },
      };
    });

    const order = await orderModel.create({
      user: userId,
      items: orderItems,
      status: "PENDING",
      totalPrice: {
        amount: totalAmount,
        currency: "INR",
      },
      shippingAddress: req.body.shippingAddress,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getMyOrder = async (req, res) => {
  const userId = req.user.userId;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const order = await orderModel
      .find({ user: userId })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalOrder = await orderModel.countDocuments({ user: userId });

    res.status(200).json({
      order,
      meta: {
        total: totalOrder,
        page,
        limit,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  const userId = req.user.userId;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden!!" });
    }

    res.status(200).json({ order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  const userId = req.user.userId;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden!!" });
    }

    if (order.status !== "PENDING") {
      return res
        .status(409)
        .json({ message: "order Not Cancel On This Stage" });
    }

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const updateOrderAddress = async (req, res) => {
  const userId = req.user.userId;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access to this order" });
    }

    // only PENDING orders can have address updated
    if (order.status !== "PENDING") {
      return res
        .status(409)
        .json({ message: "Order address cannot be updated at this stage" });
    }

    order.shippingAddress = {
      street: req.body.shippingAddress.street,
      city: req.body.shippingAddress.city,
      state: req.body.shippingAddress.state,
      pincode: req.body.shippingAddress.pincode,
      country: req.body.shippingAddress.country,
    };

    await order.save();

    res.status(200).json({ order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
//admin controller 
export const getOrderDashboard = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();

    const revenueData = await orderModel.aggregate([
      { $match: { status: { $in: ["CONFIRMED","SHIPPED","DELIVERED"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice.amount" } } }
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    const ordersByStatus = await orderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const topProduct = await orderModel.aggregate([
      { $unwind: "$item" },
      {
        $group: {
          _id: "$item.product",
          sold: { $sum: "$item.quantity" }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      ordersByStatus,
      topProduct
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order dashboard error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
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
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
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

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    //search filter (user name/email OR orderId)
    if (search) {
      const users = await userModel
        .find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        })
        .select("_id")
        .lean();

      const userIds = users.map((u) => u._id);

      if (/^[0-9a-fA-F]{24}$/.test(search)) {
        filter.$or = [{ user: { $in: userIds } }, { _id: search }];
      } else {
        filter.user = { $in: userIds };
      }
    }

    //fetch orders
    const orders = await orderModel
      .find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    //count total
    const totalOrders = await orderModel.countDocuments(filter);

    return res.json({
      success: true,
      page: pageNum,
      totalPages: Math.ceil(totalOrders / limitNum),
      totalOrders,
      data: orders,
    });
  } catch (error) {
    console.error("Failed To Get Order", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};