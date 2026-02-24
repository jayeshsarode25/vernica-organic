import MainRoutes from './routes/MainRoutes'
import Navbar from './components/Navbar/Navbar'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getMe } from './redux/reducer/userSlice';

const App = () => {

const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <div className="bg-white min-h-screen w-full text-black">

       <Navbar/>

      <MainRoutes />
     
    </div>
  )
}

export default App