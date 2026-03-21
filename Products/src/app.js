import express from "express";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.route.js";
import categoryRoute from "./routes/Category.routes.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Product service is running",
  });
});

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
