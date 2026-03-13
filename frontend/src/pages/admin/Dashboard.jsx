import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productCount } from "../../redux/reducer/productSlice";
import { fetchUserCount, fetchUsers } from "../../redux/reducer/userSlice";

const StatCard = ({ label, value, loading, iconBg, icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-5">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {loading ? (
        <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mt-1" />
      ) : (
        <p className="text-2xl font-semibold text-gray-900 mt-0.5">{value ?? "—"}</p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { total: productTotal, loading: productLoading } = useSelector((s) => s.admin);
  // ✅ state.auth.users — nested inside authSlice
  const { count: userCount, items: userItems, loading: userLoading } = useSelector(
    (s) => s.auth.users,
  );

  const blockedCount = userItems.filter((u) => u.isBlocked).length;

  useEffect(() => {
    dispatch(productCount());
    dispatch(fetchUserCount());
    dispatch(fetchUsers()); // needed to compute blockedCount
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Welcome back, Admin</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <path d="M5 6V4a3 3 0 016 0v2" stroke="#22C55E" strokeWidth="1.5" fill="none" />
            </svg>
          }
        />
        <StatCard
          label="Blocked Users"
          value={blockedCount}
          loading={userLoading}
          iconBg="bg-red-50"
          icon={
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#EF4444" strokeWidth="1.5" />
              <path d="M4 8h8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/admin/products"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#3B82F6">
                <rect x="1" y="6" width="14" height="9" rx="1" />
                <path d="M5 6V4a3 3 0 016 0v2" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">Manage Products</p>
              <p className="text-xs text-gray-400">Add, edit or remove products</p>
            </div>
          </a>
          <a href="/admin/users"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-green-300 hover:bg-green-50 transition-colors group">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#22C55E">
                <circle cx="6" cy="5" r="3" />
                <path d="M0 14c0-3.3 2.7-6 6-6s6 2.7 6 6H0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-green-700">Manage Users</p>
              <p className="text-xs text-gray-400">View, block or remove users</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;