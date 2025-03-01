import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateTokens = (UserId) => {
    const accessToken = jwt.sign({ UserId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ UserId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}

const storeRefreshToken = async (refreshToken, UserId) => {
    try {
        await redis.set(`refreshToken:${UserId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // Expiry: 7 days
    } catch (error) {
        console.error("Error storing refresh token in Redis", error);
    }
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}
// reacraete access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const storedToken = await redis.get(`refreshToken:${decode.UserId}`);

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ UserId: decode.UserId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        }) ; 
        res.json({ message:"token refresh successfully" });
    } catch (error) {
        console.error("Error refreshing token", error);
        res.status(500).json({ message: "Error refreshing token" });
    }
}

// real controllers

export const signupController = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exist" });
        }
        const user = await User.create({ name, email, password });

        // craete a refresh token and access token 

        const { accessToken, refreshToken } = await generateTokens(user._id);
        await storeRefreshToken(refreshToken, user._id);

        setCookies(res, accessToken, refreshToken);

        res.status(200).json({
            message: "User created successfully",
            data: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id)
            await storeRefreshToken(refreshToken, user._id);
            setCookies(res, accessToken, refreshToken);
            res.status(200).json({
                message: "Login successful",
                data: { _id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong in login controller", error });
    }
}

export const logoutController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // If there's a refresh token, verify and remove it from Redis
        if (refreshToken) {
            try {
                // Verify the refresh token
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                console.log(decoded)

                // Delete the refresh token from Redis using the userId
                await redis.del(`refreshToken:${decoded.UserId}`);
                console.log(`Deleted refresh token for user ${decoded.UserId} from Redis`);

            } catch (jwtError) {
                // If JWT verification fails, we can log the user out anyway (invalid token)
                return res.status(401).json({ message: "Invalid or expired refresh token" });
            }
        }

        // Clear the accessToken and refreshToken cookies from the browser
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};