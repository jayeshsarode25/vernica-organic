import dotenv  from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connetDb from "./src/db/db.js";


connetDb();


app.listen(3004,() =>{
    console.log("your order service Running port 3004")
})