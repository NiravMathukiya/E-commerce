import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB' + db.connection.host);
    } catch (error) {
        console.log("Monogodb connection error");
        console.log(error);
        process.exit(1);
    }
}