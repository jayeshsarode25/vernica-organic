import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize"; // ✅ NoSQL injection protection
import hpp from "hpp";                               // ✅ HTTP parameter pollution protection

// ─────────────────────────────────────────────────────────────────
// RATE LIMITERS
// ─────────────────────────────────────────────────────────────────

// General API — 100 requests per 15 min per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Auth routes — stricter: 10 attempts per 15 min (stops brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later." },
});

// Payment routes — very strict: 20 per 15 min
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many payment requests, please try again later." },
});

// ─────────────────────────────────────────────────────────────────
// HELMET — secure HTTP headers
// ─────────────────────────────────────────────────────────────────

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc:     ["'self'", "data:", "https://ik.imagekit.io", "https://i.pinimg.com"],
      mediaSrc:   ["'self'", "https://ik.imagekit.io"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// ─────────────────────────────────────────────────────────────────
// APPLY ALL — one call in each service's app.js
//
// IMPORTANT: call applySecurityMiddleware(app) AFTER app.use(express.json())
// so req.body is parsed before mongoSanitize runs
// ─────────────────────────────────────────────────────────────────

export const applySecurityMiddleware = (app) => {
  // 1. Secure headers
  app.use(helmetConfig);

  // 2. Rate limiting
  app.use(generalLimiter);

  // 3. Strip $ and . operators from req.body, req.query, req.params
  //    replaceWith: "_" keeps the key but neutralizes the operator
  //    onSanitize: logs when an attack attempt is caught
  app.use(
    mongoSanitize({
      replaceWith: "_",
      onSanitize: ({ req, key }) => {
        console.warn(`⚠️  NoSQL injection attempt — key [${key}] from IP ${req.ip}`);
      },
    })
  );

  // 4. Prevent HTTP parameter pollution
  //    whitelist allows these params to have multiple values legitimately
  app.use(
    hpp({
      whitelist: ["sort", "skip", "limit", "minPrice", "maxPrice", "categoryId"],
    })
  );
};