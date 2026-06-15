import _config from './src/config/config.js';
import app from './src/app.js';
import connectDB from './src/db/db.js';
import { connectRedis } from './src/db/redis.js';


await connectDB();
await connectRedis();




const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Authentication server running on port ${PORT}`);
});
