import _config from './src/config/config.js';
import app from './src/app.js';
import connectDB from './src/db/db.js';
import { connectRedis } from './src/db/redis.js';

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Auth service is running" });
});

try {
  await connectDB();
  console.log("MongoDB connected");
} catch (error) {
  console.error("MongoDB failed:", error.message);
}

try {
  await connectRedis();
  console.log("Redis connected");
} catch (error) {
  console.error("Redis failed:", error.message);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Authentication server running on port ${PORT}`);
});