import _config from './src/config/config.js';
import app from './src/app.js';
import connectDb from './src/db/db.js';


connectDb();



app.listen(3003, ()=>{
    console.log("Cart services running on port 3003")
})