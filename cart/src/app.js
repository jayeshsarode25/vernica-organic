import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'



const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


app.get('/', (req ,res)=>{
    res.status(200).json({
        message: "Cart services is Running"
    })
})


import cartRoutes from './routes/cart.route.js'
app.use('/api/cart', cartRoutes)



export default app;