import express from "express";
import { getallproduct } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getFeaturedProduct } from "../controllers/product.controller.js";
import { createProduct } from "../controllers/product.controller.js";
import { deleteProduct } from "../controllers/product.controller.js";
import { getRecommendatProduct } from "../controllers/product.controller.js";
import { getProductByCategory } from "../controllers/product.controller.js";
import { toggtFeatureProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getallproduct);
router.get("/featured", getFeaturedProduct);
router.get("/category/:category", getProductByCategory);
router.get("/recommendations", getRecommendatProduct);
router.post("/create", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggtFeatureProduct);
router.post("/:id", protectRoute, adminRoute, deleteProduct);

export default router;