import express from 'express';
import cookieParser from 'cookie-parser';
import adminRouter from '../src/routes/admin.route.js';




const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    console.log("Admin is Running");
})


app.use('/api/admin',adminRouter)

export default app;