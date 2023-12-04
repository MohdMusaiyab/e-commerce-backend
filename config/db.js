import mongoose from "mongoose";

const connectDb = async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log("Succesfully Connected To Databse");
    }
    catch(error){
        console.error(`Error in MongoDb ${error}`);
    }
}
//Now exporting the dafault function
export default connectDb;