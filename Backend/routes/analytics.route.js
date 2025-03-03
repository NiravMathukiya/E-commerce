import express from "express"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"
import { getAnalyticsData } from "../controllers/analytics.controller.js";

const router = express.Router()

router.get("/", protectRoute, adminRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailysalesData = await getDailySalesData(startDate, endDate)

        res.json({
            analyticsData,
            dailysalesData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
})

export default router