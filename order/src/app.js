import express from "express";
import cookieParser from "cookie-parser";
import orderRoutes from "../src/routes/order.route.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Order services is Running",
  });
});

app.use("/api/orders", orderRoutes);

export default app;
