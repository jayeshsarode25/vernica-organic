import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { CircleUser, Search, ShoppingBag, Menu, X } from "lucide-react";
import SearchBar from "../SearchBar";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const boxRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/product", label: "Product" },
    { path: "/about-us", label: "About" },
    { path: "/blog", label: "Blog" },
    { path: "/contact-us", label: "Contact Us" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <NavLink
            className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity duration-200"
            to="/"
          >
            <Logo />
          </NavLink>

          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                className={({ isActive }) =>
                  `text-base xl:text-lg font-medium tracking-tight transition-all duration-300 relative group ${
                    isActive
                      ? "text-green-700"
                      : "text-gray-700 hover:text-green-700"
                  }`
                }
                to={link.path}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div ref={boxRef} className="relative flex items-center">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className={`p-2 rounded-full transition-all duration-300
        ${
          open
            ? "text-green-700 bg-green-50"
            : "text-gray-700 hover:text-green-700 hover:bg-green-50"
        }`}
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {open && (
                <div className="absolute right-0 top-14 bg-white border shadow-lg rounded-xl p-4 z-50 animate-fadeIn">
                  <SearchBar close={() => setOpen(false)} />
                </div>
              )}
            </div>

            <NavLink
              className={({ isActive }) =>
                `p-2 rounded-full transition-all duration-300 relative ${
                  isActive
                    ? "text-green-700 bg-green-50"
                    : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                }`
              }
              to="/cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              {/* <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span> */}
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `hidden lg:block p-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-green-700 bg-green-50"
                    : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                }`
              }
              to="/user-profile"
              aria-label="User Profile"
            >
              <CircleUser className="w-5 h-5 md:w-6 md:h-6" />
            </NavLink>

            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-1 border-t border-gray-100">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "text-green-700 bg-green-50"
                      : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                  }`
                }
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "text-green-700 bg-green-50"
                    : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                }`
              }
              to="/user-profile"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CircleUser className="w-5 h-5" />
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
