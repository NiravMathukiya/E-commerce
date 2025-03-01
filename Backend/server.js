import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./lib/db.js";
import cookieParser from "cookie-parser";


// routes configes
import authRoutes from "./routes/auth.route.js"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser())


app.use("/api/auth", authRoutes)



app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port " + process.env.PORT);
    connectToDB();
})