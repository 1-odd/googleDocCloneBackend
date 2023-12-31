import mongoose from "mongoose";


 async function connectDB(URL){
    try {
        const connectionInstance = await mongoose.connect(URL)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.error("MongoDB connection FAILED : ",error)
       
        
    }

} 

export default connectDB;