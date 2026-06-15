import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "../components/Errorboundary";
import AuthRoute from "./AuthRoute";

const Home = lazy(() => import("../pages/Home"));
const Products = lazy(() => import("../pages/Products"));
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));
const GoogleOAuthCallback = lazy(() => import("../pages/GoogleOAuthCallback"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const BlogPage = lazy(() => import("../pages/BlogPage"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));
const ContactUs = lazy(() => import("../pages/ContactUs"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const ProdectDetail = lazy(() => import("../components/products/ProdectDetail"));
const AdminLayout = lazy(() => import("../layout/AdminLayout"));
const UserProfile = lazy(() => import("../pages/user/UserProfile"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts"));
const Users = lazy(() => import("../pages/admin/Users"));
const CheckoutPage = lazy(() => import("../pages/order/CheckoutPage"));
const PaymentPage = lazy(() => import("../pages/order/PaymentPage"));
const PaymentSuccess = lazy(() => import("../pages/order/PaymentSuccess"));
const PaymentFailed = lazy(() => import("../pages/order/PaymentFailed"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const CategoryManagement = lazy(() => import("../pages/admin/CategoryManagement"));
const BlogManagement = lazy(() => import("../pages/admin/BlogManagement"));
const CategorySection = lazy(() => import("../components/Categorysection"));
const CategoryProducts = lazy(() => import("../pages/CategoryProducts"));
const SearchResults = lazy(() => import("../components/SearchResults"));

const RouteFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
  </div>
);

const withSuspense = (element) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

const MainRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={withSuspense(<Home />)} />
        <Route path="/search" element={withSuspense(<SearchResults />)} />
        <Route path="/login" element={withSuspense(<Login />)} />
        <Route path="/signup" element={withSuspense(<SignUp />)} />
        <Route path="/sign-up" element={<Navigate to="/signup" replace />} />
        <Route
          path="/auth/google/callback"
          element={withSuspense(<GoogleOAuthCallback />)}
        />
        <Route path="/blog" element={withSuspense(<BlogPage />)} />
        <Route path="/blog/:slug" element={withSuspense(<BlogDetail />)} />
        <Route path="/about-us" element={withSuspense(<AboutUs />)} />
        <Route path="/contact-us" element={withSuspense(<ContactUs />)} />

        <Route
          path="/product"
          element={
            <ErrorBoundary message="Products page failed to load. Please refresh.">
              {withSuspense(<Products />)}
            </ErrorBoundary>
          }
        />

        <Route
          path="/product/:id"
          element={
            <ErrorBoundary message="Product details failed to load. Please try again.">
              {withSuspense(<ProdectDetail />)}
            </ErrorBoundary>
          }
        />

        <Route
          path="/shop-by-category"
          element={
            <ErrorBoundary message="Categories failed to load. Please refresh.">
              {withSuspense(<CategorySection />)}
            </ErrorBoundary>
          }
        />

        <Route
          path="/category/:slug"
          element={
            <ErrorBoundary message="Category products failed to load. Please refresh.">
              {withSuspense(<CategoryProducts />)}
            </ErrorBoundary>
          }
        />

        <Route
          path="/user-profile"
          element={
            <AuthRoute role="user">
              <ErrorBoundary message="Profile failed to load. Please refresh.">
                {withSuspense(<UserProfile />)}
              </ErrorBoundary>
            </AuthRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <AuthRoute role="user">
              <ErrorBoundary message="Checkout failed to load. Please refresh.">
                {withSuspense(<CheckoutPage />)}
              </ErrorBoundary>
            </AuthRoute>
          }
        />

        <Route
          path="/checkout/payment"
          element={
            <AuthRoute role="user">
              <ErrorBoundary message="Payment page failed to load. Please refresh.">
                {withSuspense(<PaymentPage />)}
              </ErrorBoundary>
            </AuthRoute>
          }
        />

        <Route
          path="/order/success/:orderId"
          element={
            <AuthRoute role="user">
              {withSuspense(<PaymentSuccess />)}
            </AuthRoute>
          }
        />

        <Route
          path="/order/failed"
          element={
            <AuthRoute role="user">
              {withSuspense(<PaymentFailed />)}
            </AuthRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AuthRoute role="admin">
              <ErrorBoundary message="Admin panel failed to load. Please refresh.">
                {withSuspense(<AdminLayout />)}
              </ErrorBoundary>
            </AuthRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <ErrorBoundary message="Dashboard failed to load.">
                {withSuspense(<Dashboard />)}
              </ErrorBoundary>
            }
          />
          <Route
            path="blogs"
            element={
              <ErrorBoundary message="Blog management failed to load.">
                {withSuspense(<BlogManagement />)}
              </ErrorBoundary>
            }
          />
          <Route
            path="products"
            element={
              <ErrorBoundary message="Products management failed to load.">
                {withSuspense(<AdminProducts />)}
              </ErrorBoundary>
            }
          />
          <Route
            path="orders"
            element={
              <ErrorBoundary message="Orders failed to load.">
                {withSuspense(<Orders />)}
              </ErrorBoundary>
            }
          />
          <Route
            path="users"
            element={
              <ErrorBoundary message="Users failed to load.">
                {withSuspense(<Users />)}
              </ErrorBoundary>
            }
          />
          <Route
            path="categories"
            element={
              <ErrorBoundary message="Category management failed to load.">
                {withSuspense(<CategoryManagement />)}
              </ErrorBoundary>
            }
          />
        </Route>

        <Route path="*" element={withSuspense(<PageNotFound />)} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
