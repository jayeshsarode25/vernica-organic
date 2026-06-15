import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productCount } from "../../redux/reducer/productSlice";
import { fetchUserCount, fetchUsers } from "../../redux/reducer/userSlice";
import { getDashboard } from "../../redux/reducer/orderSlice";
import { fetchCategories } from "../../redux/reducer/Categoryslice"; 
import { getAllBlogsAdmin } from "../../redux/reducer/Blogslice"; // ← ADD THIS
import { Link } from "react-router-dom";

const StatCard = ({ label, value, loading, iconBg, icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-5">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {loading ? (
        <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mt-1" />
      ) : (
        <p className="text-2xl font-semibold text-gray-900 mt-0.5">
          {value ?? "—"}
        </p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    admin: { total: productTotal },
    loading: productLoading,
  } = useSelector((s) => s.products);

  const {
    count: userCount,
    loading: userLoading,
  } = useSelector((s) => s.auth.users);

  // Add order dashboard state
  const { dashboardData: orderDashboard, loading: orderLoading } = useSelector(
    (s) => s.order
  );

  // ← ADD THIS - Categories state
  const { categories, loading: categoryLoading } = useSelector(
    (s) => s.categories
  );

  // ← ADD THIS - Blog state
  const { blogs, loading: blogLoading } = useSelector(
    (s) => s.blogs
  );

  const totalOrders = orderDashboard?.totalOrders || 0;
  const totalRevenue = orderDashboard?.totalRevenue || 0;
  const categoryCount = categories?.length || 0; // ← ADD THIS
  const blogCount = blogs?.length || 0; // ← ADD THIS

  useEffect(() => {
    dispatch(productCount());
    dispatch(fetchUserCount());
    dispatch(fetchUsers());
    dispatch(getDashboard()); // Fetch order dashboard data
    dispatch(fetchCategories()); // ← ADD THIS - Fetch categories
    dispatch(getAllBlogsAdmin({ page: 1, limit: 10 })); // ← ADD THIS - Fetch blogs
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Welcome back, Admin</p>

      {/* ← UPDATED: Changed from 5 columns to 6 columns for blogs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        <StatCard
          label="Total Users"
          value={userCount}
          loading={userLoading}
          iconBg="bg-blue-50"
          icon={
            <svg width="22" height="22" viewBox="0 0 16 16" fill="#3B82F6">
              <circle cx="6" cy="5" r="3" />
              <path d="M0 14c0-3.3 2.7-6 6-6s6 2.7 6 6H0z" />
              <circle cx="12" cy="4" r="2.2" />
              <path d="M10 14c0-1.9.6-3.6 1.6-5H16v5h-6z" />
            </svg>
          }
        />
        <StatCard
          label="Total Products"
          value={productTotal}
          loading={productLoading}
          iconBg="bg-green-50"
          icon={
            <svg width="22" height="22" viewBox="0 0 16 16" fill="#22C55E">
              <rect x="1" y="6" width="14" height="9" rx="1" />
              <path
                d="M5 6V4a3 3 0 016 0v2"
                stroke="#22C55E"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          }
        />
        <StatCard
          label="Total Categories"
          value={categoryCount}
          loading={categoryLoading}
          iconBg="bg-orange-50"
          icon={
            <svg width="22" height="22" viewBox="0 0 16 16" fill="#F97316">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          }
        />
        {/* ← ADD THIS - Blog stat card */}
        <StatCard
          label="Total Blogs"
          value={blogCount}
          loading={blogLoading}
          iconBg="bg-pink-50"
          icon={
            <svg width="22" height="22" viewBox="0 0 16 16" fill="#EC4899">
              <path d="M2 2h12v2H2V2z" />
              <path d="M2 5h12v1H2V5z" />
              <path d="M2 7h8v1H2V7z" />
              <path d="M2 9h12v1H2V9z" />
              <path d="M2 11h10v1H2v-1z" />
            </svg>
          }
        />
        <StatCard
          label="Total Orders"
          value={totalOrders}
          loading={orderLoading}
          iconBg="bg-purple-50"
          icon={
            <svg width="22" height="22" viewBox="0 0 16 16" fill="#A855F7">
              <path d="M2 2h12v1H2V2z" />
              <path d="M2 5h12v7H2V5z" />
              <rect x="2" y="4" width="12" height="8" rx="1" fill="none" stroke="#A855F7" strokeWidth="1.5" />
              <path d="M4 7h8M4 10h6" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          loading={orderLoading}
          iconBg="bg-yellow-50"
          icon={
            <svg width="22" height="22" viewBox="0 0 16 16" fill="#FBBF24">
              <circle cx="8" cy="8" r="6" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
              <path d="M8 5v6M6 8h4" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick actions</p>
        {/* ← UPDATED: Changed from 5 columns to 6 columns for blogs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#3B82F6">
                <rect x="1" y="1" width="6" height="6" rx="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" />
                <rect x="9" y="9" width="6" height="6" rx="1.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
                Dashboard
              </p>
              <p className="text-xs text-gray-400">View all stats</p>
            </div>
          </Link>

          {/* ← ADD THIS - Blogs Quick Action */}
          <Link
            to="/admin/blogs"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-pink-300 hover:bg-pink-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#EC4899">
                <path d="M2 2h12v2H2V2z" />
                <path d="M2 5h12v1H2V5z" />
                <path d="M2 7h8v1H2V7z" />
                <path d="M2 9h12v1H2V9z" />
                <path d="M2 11h10v1H2v-1z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-pink-700">
                Manage Blogs
              </p>
              <p className="text-xs text-gray-400">Create and manage blogs</p>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-orange-300 hover:bg-orange-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#F97316">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-orange-700">
                Manage Categories
              </p>
              <p className="text-xs text-gray-400">Create and manage categories</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#A855F7">
                <path d="M2 2h12v1H2V2z" />
                <path d="M2 5h12v7H2V5z" />
                <rect x="2" y="4" width="12" height="8" rx="1" fill="none" stroke="#A855F7" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-purple-700">
                Manage Orders
              </p>
              <p className="text-xs text-gray-400">View and track orders</p>
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#22C55E">
                <rect x="1" y="6" width="14" height="9" rx="1" />
                <path
                  d="M5 6V4a3 3 0 016 0v2"
                  stroke="#22C55E"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-green-700">
                Manage Products
              </p>
              <p className="text-xs text-gray-400">Add, edit or remove products</p>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#3B82F6">
                <circle cx="6" cy="5" r="3" />
                <path d="M0 14c0-3.3 2.7-6 6-6s6 2.7 6 6H0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
                Manage Users
              </p>
              <p className="text-xs text-gray-400">View, block or remove users</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
