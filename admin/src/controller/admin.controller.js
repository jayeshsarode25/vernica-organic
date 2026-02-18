import orderModel from "../model/order.model.js";
import userModel from "../model/user.model.js";
import productModel from "../model/product.model.js";

export async function getDashbordMetries(req, res) {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const totalOrders = await orderModel.countDocuments();

    const revenueData = await orderModel.aggregate([
      { $match: { status: { $in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice.amount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    const ordersByStatus = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const topProduct = await orderModel.aggregate([
      { $unwind: "$item" },
      {
        $group: {
          _id: "$item.product",
          sold: { $sum: "$item.quantity" },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]);

    return res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      ordersByStatus,
      topProduct,
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

