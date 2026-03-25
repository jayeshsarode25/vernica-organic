import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import PageNotFound from "../pages/PageNotFound";
import BlogPage from "../pages/BlogPage";
import ContactUs from "../pages/Contactus";
import AboutUs from "../pages/AboutUs";
import ProdectDetail from "../components/products/ProdectDetail";
import AuthRoute from "./AuthRoute";
import AdminLayout from "../layout/AdminLayout";
import UserProfile from "../pages/user/UserProfile";
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import Users from "../pages/admin/Users";
import CheckoutPage from "../pages/order/CheckoutPage";
import PaymentPage from "../pages/order/PaymentPage";
import Orders from "../pages/admin/Orders";
import CategoryManagement from "../pages/admin/CategoryManagement";
import CategorySection from "../components/CategorySection";
import CategoryProducts from "../pages/CategoryProducts";

const MainRoutes = () => {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<ProdectDetail />} />
        <Route path="/shop-by-category" element={<CategorySection />} />
        <Route path="/category/:slug" element={<CategoryProducts />} />

        {/* User protected routes */}
        <Route
          path="/user-profile"
          element={
            <AuthRoute role="user">
              <UserProfile />
            </AuthRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <AuthRoute role="user">
              <CheckoutPage />
            </AuthRoute>
          }
        />
        <Route
          path="/checkout/payment"
          element={
            <AuthRoute role="user">
              <PaymentPage />
            </AuthRoute>
          }
        />

        {/* Admin protected routes — layout wraps once */}
        <Route
          path="/admin"
          element={
            <AuthRoute role="admin">
              <AdminLayout />
            </AuthRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
