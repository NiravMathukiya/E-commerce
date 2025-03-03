import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

dotenv.config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Please add products to the cart." });
        }

        let totalAmount = 0;
        products.forEach((product) => {
            totalAmount += Math.round(product.price) * product.quantity;
        });

        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({
                code: couponCode,
                userId: req.user._id,
                isActive: true,
            });

            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }

        const order = await razorpay.orders.create({
            amount: totalAmount * 100, // Convert to paise
            currency: "INR",
            receipt: `order_rcpt_${Date.now()}`,
            payment_capture: 1,
        });

        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }

        res.status(200).json({ orderId: order.id, totalAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Razorpay order" });
    }
};

// Verify Razorpay Payment Signature
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, products } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // Disable coupon if used
        if (req.body.couponCode) {
            await Coupon.findOneAndUpdate(
                { code: req.body.couponCode, userId: userId },
                { isActive: false }
            );
        }

        // Save order
        const newOrder = new Order({
            user: userId,
            products: products.map((p) => ({
                product: p.id,
                quantity: p.quantity,
                price: p.price,
            })),
            totalAmount: req.body.amount,
            razorpayPaymentId: razorpay_payment_id,
        });

        await newOrder.save();

        res.status(200).json({ success: true, message: "Order created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing payment", error: error.message });
    }
};

// Generate a new coupon
async function createNewCoupon(userId) {
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId,
    });

    await newCoupon.save();
    return newCoupon;
}
