import { config as dotenvconfig } from "dotenv";
dotenvconfig();

// ─────────────────────────────────────────────────────────────────
// ENV VALIDATOR — Order Service
// ─────────────────────────────────────────────────────────────────

const REQUIRED_VARS = [
  "MONGO_URI",
  "JWT_SECRET",
  "RABBITMQ_URI",
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error("❌ Missing required environment variables:");
  missing.forEach((key) => console.error(`   - ${key}`));
  console.error("\nAdd the missing variables to your .env file and restart.");
  process.exit(1);
}

const _config = {
  MONGO_URI:        process.env.MONGO_URI,
  JWT_SECRET:       process.env.JWT_SECRET,
  RABBITMQ_URI:     process.env.RABBITMQ_URI,
  CART_API_URL:     process.env.CART_API_URL || "http://localhost:3003/api/cart",
  PRODUCT_API_URL:  process.env.PRODUCT_API_URL || "http://localhost:3002/api/products",
};

export default _config;
