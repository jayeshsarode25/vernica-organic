import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AuthRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;

};

export default AuthRoute;