import MainRoutes from "./routes/MainRoutes";
import Navbar from "./components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMe } from "./redux/reducer/userSlice";
import { getCart } from "./redux/reducer/cartSlice";
import RoleRedirect from "./routes/Roleredirect";

const VernikaChatbot = lazy(() => import("./components/chatbot/VernikaChatbot"));

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");


  useEffect(() => {
    let isMounted = true;

    dispatch(getMe()).finally(() => {
      if (isMounted) {
        setAuthChecked(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  
  useEffect(() => {
  if (user && user.role === "user") {
    dispatch(getCart());
  }
}, [user, dispatch]);

  if (!authChecked) return (
  <div className="flex items-center justify-center h-screen text-sm text-gray-400">
    Loading...
  </div>
);

  return (
    <div className="bg-white min-h-screen w-full text-black">
      <RoleRedirect/>
      {!isAdminRoute && <Navbar />}
      <MainRoutes />
      {!isAdminRoute && (
        <Suspense fallback={null}>
          <VernikaChatbot />
        </Suspense>
      )}
    </div>
  );
};

export default App;
