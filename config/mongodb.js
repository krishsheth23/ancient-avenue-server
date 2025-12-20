import mongoose from "mongoose";

const connectDB = async () => {

    try {
        mongoose.connection.on('connected', () => {
            console.log("Successfully Connected to Database")
        })

        await mongoose.connect(`${process.env.MONGODB_URI}/Avenue`)
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        console.error("Please check your MONGODB_URI in .env and ensure your IP is whitelisted in MongoDB Atlas.");
    }

}

export default connectDB;