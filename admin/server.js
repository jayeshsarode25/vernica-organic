import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import connectDb from './src/db/db.js';


connectDb();


app.listen(3007, ()=> {
    console.log("Admin panel Running on port 3007")
})