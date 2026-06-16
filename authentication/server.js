import app from './src/app.js';
import connectDB from './src/db/db.js';

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Authentication server running on port ${PORT}`);
});