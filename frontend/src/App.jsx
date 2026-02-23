import MainRoutes from './routes/MainRoutes'
import Navbar from './components/Navbar/Navbar'

const App = () => {
  return (
    <div className="bg-white min-h-screen w-full text-black">

       <Navbar/>

      <MainRoutes />
     
    </div>
  )
}

export default App