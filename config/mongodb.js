import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("Successfully Connected to Database")
    })

    if (mongoose.connections[0].readyState) {
        return;
    }

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        console.error("Please check your MONGODB_URI in .env and ensure your IP is whitelisted in MongoDB Atlas.");
    }
}

export default connectDB;