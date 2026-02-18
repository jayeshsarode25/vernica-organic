import userModel from "../model/user.model.js";
import orderModel from "../model/order.model.js";

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

export const getOrderById = async (req, res) => {
    const orderId = req.params.id
  try {
    const order = await orderModel.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

