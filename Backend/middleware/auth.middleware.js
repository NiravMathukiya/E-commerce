import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No token Provided" });
        }
        try {
            const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decode.UserId).select("-password");

            if (!user) {
                return res.status(401).json({ message: "Unauthorized - User not found" });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Token Expired" });
            }
            throw error;
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "unauthorized invlid access token" });
    }
};

export const adminRoute = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden - Access Denied" });
    }
};