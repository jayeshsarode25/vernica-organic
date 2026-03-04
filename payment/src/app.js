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


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Payment service is running"
    });
});


import paymentRoute from '../src/routes/paymenr.route.js'
app.use('/api/payments', paymentRoute)



export default app;