import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  applySecurityMiddleware,
  paymentLimiter,
} from "./middleware/Security.middleware.js";
import { globalErrorHandler } from './utils/error.utils.js';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
applySecurityMiddleware(app);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Payment service is running",
  });
});

import paymentRoute from "../src/routes/paymenr.route.js";
app.use("/api/payments", paymentLimiter, paymentRoute);


app.use(globalErrorHandler);

export default app;
