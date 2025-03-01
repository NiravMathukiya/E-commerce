import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Import bcryptjs for hashing and comparing passwords

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required. Please input that..."],
        },
        email: {
            type: String,
            required: [true, "Email is required. Please input that..."],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required. Please input that..."],
            minlength: [6, "Password must be at least 6 characters long."],
        },
        cartItems: [
            {
                quantity: {
                    type: Number,
                    default: 1,
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
            },
        ],
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
    },
    // Timestamps means that we add two fields: createdAt and updatedAt
    { timestamps: true }
);

// Pre-save hook to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare the entered password with the hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); // `this.password` refers to the hashed password
};
;

const User = mongoose.model("User", userSchema);

export default User;
