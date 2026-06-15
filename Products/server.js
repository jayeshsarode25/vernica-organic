import _config from "./src/config/config.js";
import app from "./src/app.js";
import connectDb from "./src/db/db.js";


await connectDb();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () =>{
    console.log(`product services running on port ${PORT}`)
})
