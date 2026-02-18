import paymentModel from "../model/payment.model.js";
import axios from "axios";
import razorpay from "../config/razorpay.js";
import config from "../config/config.js";
import { validatePaymentVerification } from "../../node_modules/razorpay/dist/utils/razorpay-utils.js";
import crypto from "crypto";

export const createPayment = async (req, res) => {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
  const userId = req.user.userId;

  try {
    const orderId = req.params.orderId;

    const orderResponce = await axios.get(
      "http://localhost:3004/api/orders/" + orderId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const price = orderResponce.data.order.totalPrice;

    const order = await razorpay.orders.create(price);

    const newPayment = await paymentModel.create({
      order: orderId,
      razorpayOrderId: order.id,
      user: userId,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
    });

    return res.status(201).json({ message: "Payment initiated", newPayment });
  } catch (error) {
    console.error("Error creating payment", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpayOrderId, paymentId, signature } = req.body;
  const secret = config.RAZORPAY_KEY_SECRET;

  try {
    const isValid = validatePaymentVerification(
      {
        order_id: razorpayOrderId,
        payment_id: paymentId,
      },
      signature,
      secret,
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid Signature" });
    }

    const payment = await paymentModel.findOne({
      razorpayOrderId,
      status: "PENDING",
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment Not Found" });
    }

    ((payment.paymentId = paymentId),
      (payment.signature = signature),
      (payment.status = "COMPLETED"));

    await payment.save();

    res.status(200).json({ message: "Payment Verify Successfully", payment });
  } catch (error) {
    console.error("Error creating payment", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};


// export const generateTestSignature = (req, res) => {
//   const { razorpayOrderId, paymentId } = req.body;

//   const body = razorpayOrderId + "|" + paymentId;

//   const signature = crypto
//     .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
//     .update(body)
//     .digest("hex");

//   res.json({ signature });
// };