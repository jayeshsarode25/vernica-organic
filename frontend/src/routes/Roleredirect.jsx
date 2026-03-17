import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

// Redirects user to the right place based on role
// — after login
// — after refresh (getMe resolves)
const RoleRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (loading || !user) return; // wait until getMe finishes

    const isOnAdminRoute = location.pathname.startsWith("/admin");
    const isOnAuthRoute  = location.pathname.startsWith("/login") ||
                           location.pathname.startsWith("/signup");

    if (user.role === "admin") {
      // admin on home or auth pages → push to admin panel
      if (!isOnAdminRoute) navigate("/admin/dashboard", { replace: true });
    } else {
      // normal user on admin routes → push to home
      if (isOnAdminRoute) navigate("/", { replace: true });
      // normal user on login/signup after already logged in → push to home
      if (isOnAuthRoute) navigate("/", { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  return null; // this component renders nothing
};

export default RoleRedirect;