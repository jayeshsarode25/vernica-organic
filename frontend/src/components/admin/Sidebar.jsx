import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducer/userSlice"; // Adjust path
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useState } from "react";

const links = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" rx="1.5" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    to: "/admin/blogs",
    label: "Blogs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 2h12v2H2V2z" />
        <path d="M2 5h12v1H2V5z" />
        <path d="M2 7h8v1H2V7z" />
        <path d="M2 9h12v1H2V9z" />
        <path d="M2 11h10v1H2v-1z" />
      </svg>
    ),
  },
  {
    to: "/admin/categories",
    label: "Categories",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 3L8 1L14 3V7L8 9L2 7V3Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M2 7L8 9L14 7" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 9V15" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 7V11C2 12.1 4.7 13 8 13C11.3 13 14 12.1 14 11V7" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
    ),
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="6" width="14" height="9" rx="1" />
        <path d="M5 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="6" cy="5" r="3" />
        <path d="M0 14c0-3.3 2.7-6 6-6s6 2.7 6 6H0z" />
        <circle cx="12" cy="4" r="2.2" />
        <path d="M10 14c0-1.9.6-3.6 1.6-5H16v5h-6z" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Get user from Redux
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logout());

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login", { replace: true });
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <>
      <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold tracking-tight">Admin Panel</h2>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 px-3 pb-2">
            Main
          </p>
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span className="opacity-80">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer - User & Logout */}
        <div className="px-3 py-4 border-t border-white/10 space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-gray-900 font-semibold text-sm flex-shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 font-medium text-sm transition-colors border border-red-500/30"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <LogOut className="text-red-600" size={24} />
            </div>

            {/* Content */}
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Logout
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to logout? You'll need to login again to access the admin panel.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
