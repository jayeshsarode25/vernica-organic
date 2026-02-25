import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AuthRoute = ({ children, role }) => {
  const { user, loading } = useSelector((state) => state.auth);
  console.log("AUTH USER:", user);
  const location = useLocation();

  if (loading) return null; 

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;