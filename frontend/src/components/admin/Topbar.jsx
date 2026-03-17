import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducer/userSlice"; // Adjust path
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

/**
 * TopBar Component - Add this to your existing AdminLayout
 * Place it above the <Outlet /> and below the Sidebar
 */
const TopBar = ({ onMenuToggle, mobileMenuOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Get user from Redux
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // Dispatch logout action to Redux
    dispatch(logout());

    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login", { replace: true });
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "A";
  const userName = user?.name || "Admin User";
  const userEmail = user?.phone || "admin@example.com";

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        {/* Left: Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? (
            <X size={24} className="text-gray-600" />
          ) : (
            <Menu size={24} className="text-gray-600" />
          )}
        </button>

        {/* Right: User Profile & Logout */}
        <div className="ml-auto flex items-center gap-4">
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userInitial}
              </div>

              {/* User Info - Hidden on mobile */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>

              {/* Chevron */}
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-600">{userEmail}</p>
                </div>

                {/* Menu Items */}
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors">
                  👤 Profile
                </button>

                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors">
                  ⚙️ Settings
                </button>

                <div className="border-t border-gray-200" />

                {/* Logout */}
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 font-medium transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Direct Logout Button (Alternative) */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="hidden sm:flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors border border-red-200"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
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

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Logout
            </h2>

            {/* Message */}
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

export default TopBar;