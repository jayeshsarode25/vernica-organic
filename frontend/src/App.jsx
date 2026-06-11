import MainRoutes from "./routes/MainRoutes";
import Navbar from "./components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getMe } from "./redux/reducer/userSlice";
import { getCart } from "./redux/reducer/cartSlice";
import RoleRedirect from "./routes/Roleredirect";
import VernikaChatbot from "./components/chatbot/VernikaChatbot";


const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);


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
      <Navbar />  
      <MainRoutes />
      <VernikaChatbot />
    </div>
  );
};

export default App;
