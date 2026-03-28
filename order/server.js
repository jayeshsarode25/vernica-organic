import _config from "./src/config/config.js";
import app from "./src/app.js";
import connetDb from "./src/db/db.js";


connetDb();


app.listen(3004,() =>{
    console.log("your order service Running port 3004")
})