import MainRoutes from "./routes/MainRoutes";
import Navbar from "./components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMe } from "./redux/reducer/userSlice";
import { getCart } from "./redux/reducer/cartSlice";
import RoleRedirect from "./routes/Roleredirect";


const App = () => {
  const dispatch = useDispatch();
  const { user,loading } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  
  useEffect(() => {
  if (user && user.role === "user") {
    dispatch(getCart());
  }
}, [user, dispatch]);

  if (loading) return (
  <div className="flex items-center justify-center h-screen text-sm text-gray-400">
    Loading...
  </div>
);

  return (
    <div className="bg-white min-h-screen w-full text-black">
      <RoleRedirect/>
      <Navbar />  
      <MainRoutes />
    </div>
  );
};

export default App;