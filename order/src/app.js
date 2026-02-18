import express from 'express';
import cookieParser from 'cookie-parser';
import orderRoutes from '../src/routes/order.route.js'



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/',(req , res) =>{
    res.status(200).json({
        message: "Order services is Running"
    })
})




app.use('/api/orders',orderRoutes);


export default app;
