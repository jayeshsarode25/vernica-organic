export const API_URLS = {
  auth: import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/api/auth",
  products:
    import.meta.env.VITE_PRODUCTS_API_URL || "http://localhost:3002/api/products",
  categories:
    import.meta.env.VITE_CATEGORIES_API_URL || "http://localhost:3002/api/categories",
  blogs: import.meta.env.VITE_BLOGS_API_URL || "http://localhost:3002/api/blogs",
  cart: import.meta.env.VITE_CART_API_URL || "http://localhost:3003/api/cart",
  orders:
    import.meta.env.VITE_ORDERS_API_URL || "http://localhost:3004/api/orders",
  payments:
    import.meta.env.VITE_PAYMENTS_API_URL || "http://localhost:3006/api/payments",
};
