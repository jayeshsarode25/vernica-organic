import _config from "./src/config/config.js";
import app from "./src/app.js";
import connetDb from "./src/db/db.js";


await connetDb();


const PORT = process.env.PORT || 3004;

app.listen(PORT,() =>{
    console.log(`your order service Running port ${PORT}`)
})
