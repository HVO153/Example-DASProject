import mongoose from "mongoose";

const connectDB = async () =>{
try {
    mongoose.connect(process.env.MONGO_URI as string,{
        dbName: "blog",
    });
    
    console.log("Connected to MongoDB");
} catch (error) {
    console.log(error);
}   
};

export default connectDB;