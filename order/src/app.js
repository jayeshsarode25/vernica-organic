import express from "express";
import cookieParser from "cookie-parser";
import orderRoutes from "../src/routes/order.route.js";
import cors from "cors";
import { applySecurityMiddleware } from './middleware/Security.middleware.js';
import {globalErrorHandler} from './utils/error.utils.js'


const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
applySecurityMiddleware(app);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Order services is Running",
  });
});

app.use("/api/orders", orderRoutes);

app.use(globalErrorHandler)

export default app;
