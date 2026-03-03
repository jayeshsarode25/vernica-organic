import { Route, Routes } from "react-router-dom";
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


const MainRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<ProdectDetail />} />
      
        <Route
          path="/user-profile"
          element={
            <AuthRoute role="user">
              < UserProfile/>
            </AuthRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <AuthRoute role="user">
              < CheckoutPage/>
            </AuthRoute>
          }
        />

        

        <Route
          path="/admin/dashboard"
          element={
            <AuthRoute role="admin">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AuthRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AuthRoute role="admin">
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </AuthRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AuthRoute role="admin">
              <AdminLayout>
                <Users />
              </AdminLayout>
            </AuthRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
