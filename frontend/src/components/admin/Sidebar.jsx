import { NavLink } from "react-router-dom";

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
  return (
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
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="opacity-80">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <p className="text-xs text-gray-500 px-3">Admin • Logged in</p>
      </div>
    </div>
  );
};

export default Sidebar;