import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import { CircleUser, Search, ShoppingBag, Menu, X } from "lucide-react";
import SearchBar from "../SearchBar";
import CartDrawer from "../cart/cartDrawer";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const boxRef = useRef();

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart); 

  const cartCount = items?.length || 0;

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
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <NavLink className="text-xl md:text-2xl font-bold" to="/">
              <Logo />
            </NavLink>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  className={({ isActive }) =>
                    `text-base font-medium transition-all duration-300 ${
                      isActive
                        ? "text-green-700"
                        : "text-gray-700 hover:text-green-700"
                    }`
                  }
                  to={link.path}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div ref={boxRef} className="relative">
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="p-2 rounded-full hover:bg-green-50"
                >
                  <Search className="w-5 h-5" />
                </button>

                {open && (
                  <div className="absolute right-0 top-14 bg-white border shadow-lg rounded-xl p-4 z-50">
                    <SearchBar close={() => setOpen(false)} />
                  </div>
                )}
              </div>

              {user ? (
                <>
                  <button
                    onClick={() => setCartOpen(true)}
                    className="relative p-2 rounded-full hover:bg-green-50"
                  >
                    <ShoppingBag className="w-5 h-5" />

                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <NavLink
                    to="/user-profile"
                    className="hidden lg:block p-2 rounded-full hover:bg-green-50"
                  >
                    <CircleUser className="w-5 h-5" />
                  </NavLink>
                </>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-700"
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                  >
                    Signup
                  </NavLink>
                </div>
              )}

              <button
                className="lg:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2"
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  <button
                    onClick={() => {
                      setCartOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block px-4 py-2"
                  >
                    Cart ({cartCount})
                  </button>

                  <NavLink
                    to="/user-profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2"
                  >
                    Profile
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="block px-4 py-2">
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="block px-4 py-2">
                    Signup
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </>
  );
};

export default Navbar;
