import dotenv from 'dotenv'
dotenv.config();
import app from './src/app.js';
import connectDb from './src/db/db.js';


connectDb();


app.listen(3006, () =>{
    console.log("Payment service Running on 3006")
})