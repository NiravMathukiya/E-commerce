import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";


export const getallproduct = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        console.log("erro in gat all prodcut controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getFeaturedProduct = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_Products");
        if (featuredProducts) {
            return res.json({ products: JSON.parse(featuredProducts) });
        }
        // lean return error in javascript fromat instand of mongodb {}
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        // store in radis for fast access

        await redis.set("featured_Products", JSON.stringify(featuredProducts));
        res.json({ products: featuredProducts });

    } catch (error) {
        console.log("erro in gat all prodcut controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const prodcut = await Product.findByIdAndDelete(req.params.id);
        if (!prodcut) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (prodcut.image) {
            const publicId = prodcut.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from Cloudinary");
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("erro in delete product controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getRecommendatProduct = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 }
            }, {
                $project: {
                    name: 1,
                    description: 1,
                    price: 1,
                    image: 1,
                    category: 1
                }
            }
        ])
    }
    catch (error) {
        console.log("erro in getRecommendatProduct controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getProductByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json({ products });
    } catch (error) {
        console.log("erro in gat all prodcut controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const toggtFeatureProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFecturedProductsCache();
            res.json({ updatedProduct });
        }
    }
    catch (error) {
        console.log("erro in gat all prodcut controller", error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}
async function updateFecturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_Products", JSON.stringify(featuredProducts));

    } catch (error) {
        console.log("erro in updateFecturedProductsCache", error);
    }
}

