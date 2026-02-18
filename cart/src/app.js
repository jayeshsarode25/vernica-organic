import express from 'express';
import cookieParser from 'cookie-parser';



const app = express();
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