import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required. Please input that..."],
    },
    description: {
        type: String,
        required: [true, "Description is required. Please input that..."],
    },
    price: {
        type: Number,
        min: 0,
        required: [true, "Price is required. Please input that..."],
    },
    image: {
        type: String,
        required: [true, "Image is required. Please input that..."],
    },
    category: {
        type: String,
        required: [true, "Category is required. Please input that..."],
    },
    isFectured :{
        type:Boolean,
        default:false

    },

    // rating: {
    //     type: Number,
    //     default: 0,
    // },
    // numReviews: {
    //     type: Number,
    //     default: 0,
    // },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product