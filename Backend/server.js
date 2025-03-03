import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./lib/db.js";
import cookieParser from "cookie-parser";


// routes configes
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponsRoutes from "./routes/coupons.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytics.route.js"

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponsRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)


app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port " + process.env.PORT);
    connectToDB();
})