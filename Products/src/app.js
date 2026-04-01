import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRoutes from "./routes/product.route.js";
import categoryRoute from "./routes/Category.routes.js";
import { applySecurityMiddleware } from "./middleware/Security.middleware .js";
import { globalErrorHandler } from "./utils/error.utils.js"; 

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
  res.status(200).json({ message: "Product service is running" });
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.use(globalErrorHandler);

export default app;
