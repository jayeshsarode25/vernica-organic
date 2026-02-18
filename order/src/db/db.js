import mongoose from "mongoose";
import config from "../config/config.js";


const connetDb = async ()=>{
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to mongoDB");
    } catch (error) {
        console.log("Error while connecting to mongoDB", error);
    }
}


export default connetDb;