import express from 'express';
import cookieParser from 'cookie-parser';



const app = express();
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