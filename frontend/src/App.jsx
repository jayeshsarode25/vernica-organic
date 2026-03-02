import MainRoutes from "./routes/MainRoutes";
import Navbar from "./components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMe } from "./redux/reducer/userSlice";
import { getCart } from "./redux/reducer/cartSlice";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  
  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [user, dispatch]);

  return (
    <div className="bg-white min-h-screen w-full text-black">
      <Navbar />
      <MainRoutes />
    </div>
  );
};

export default App;