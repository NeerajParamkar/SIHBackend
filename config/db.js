import mongoose from "mongoose";
//conecting mongodb 
const connectDB =async()=>{
    try{
         await mongoose.connect(process.env.MONGO_URI)
         console.log("mongoDb connected successfully")
    }catch(error){
        console.log("error:", error.message);
        process.exit(1);
    }
}

export default connectDB;
