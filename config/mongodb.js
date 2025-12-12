import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected',() => {
        console.log("Successfully Connected to Database")
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/Avenue`)

}

export default connectDB;