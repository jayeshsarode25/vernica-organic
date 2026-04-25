import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import PageNotFound from "../pages/PageNotFound";
import BlogPage from "../pages/BlogPage";
import BlogDetail from "../pages/BlogDetail"; // ← ADD THIS
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
import BlogManagement from "../pages/admin/BlogManagement"; // ← ADD THIS
import CategorySection from "../components/Categorysection";
import CategoryProducts from "../pages/CategoryProducts";
import ErrorBoundary from "../components/Errorboundary";
import SearchResults from "../components/SearchResults";

const MainRoutes = () => {
  return (
    <div>
      <Routes>
 
        {/* ── Static routes — no ErrorBoundary needed ── */}
        <Route path="/"          element={<Home />} />
        <Route path="/search" element={<SearchResults />} /> 
        <Route path="/login"     element={<Login />} />
        <Route path="/sign-up"   element={<SignUp />} />
        <Route path="/blog"     element={<BlogPage />} /> {/* ← CHANGED from /blog to /blogs */}
        <Route path="/blog/:slug" element={<BlogDetail />} /> {/* ← ADD THIS - Single blog detail */}
        <Route path="/about-us"  element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
 
        {/* ── Data-fetching public routes — wrap with ErrorBoundary ── */}
        <Route path="/product" element={
          <ErrorBoundary message="Products page failed to load. Please refresh.">
            <Products />
          </ErrorBoundary>
        } />
 
        <Route path="/product/:id" element={
          <ErrorBoundary message="Product details failed to load. Please try again.">
            <ProdectDetail />
          </ErrorBoundary>
        } />
 
        <Route path="/shop-by-category" element={
          <ErrorBoundary message="Categories failed to load. Please refresh.">
            <CategorySection />
          </ErrorBoundary>
        } />
 
        <Route path="/category/:slug" element={
          <ErrorBoundary message="Category products failed to load. Please refresh.">
            <CategoryProducts />
          </ErrorBoundary>
        } />
 
        {/* ── User protected routes ── */}
        <Route path="/user-profile" element={
          <AuthRoute role="user">
            <ErrorBoundary message="Profile failed to load. Please refresh.">
              <UserProfile />
            </ErrorBoundary>
          </AuthRoute>
        } />
 
        <Route path="/checkout" element={
          <AuthRoute role="user">
            <ErrorBoundary message="Checkout failed to load. Please refresh.">
              <CheckoutPage />
            </ErrorBoundary>
          </AuthRoute>
        } />
 
        <Route path="/checkout/payment" element={
          <AuthRoute role="user">
            <ErrorBoundary message="Payment page failed to load. Please refresh.">
              <PaymentPage />
            </ErrorBoundary>
          </AuthRoute>
        } />
 
        {/* ── Admin protected routes ── */}
        <Route path="/admin" element={
          <AuthRoute role="admin">
            <ErrorBoundary message="Admin panel failed to load. Please refresh.">
              <AdminLayout />
            </ErrorBoundary>
          </AuthRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
 
          <Route path="dashboard" element={
            <ErrorBoundary message="Dashboard failed to load.">
              <Dashboard />
            </ErrorBoundary>
          } />

          {/* ← ADD THIS - Blog Management Route */}
          <Route path="blogs" element={
            <ErrorBoundary message="Blog management failed to load.">
              <BlogManagement />
            </ErrorBoundary>
          } />
 
          <Route path="products" element={
            <ErrorBoundary message="Products management failed to load.">
              <AdminProducts />
            </ErrorBoundary>
          } />
 
          <Route path="orders" element={
            <ErrorBoundary message="Orders failed to load.">
              <Orders />
            </ErrorBoundary>
          } />
 
          <Route path="users" element={
            <ErrorBoundary message="Users failed to load.">
              <Users />
            </ErrorBoundary>
          } />
 
          <Route path="categories" element={
            <ErrorBoundary message="Category management failed to load.">
              <CategoryManagement />
            </ErrorBoundary>
          } />
        </Route>
 
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;