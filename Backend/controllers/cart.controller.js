import Product from "../models/product.model.js";


export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
}


export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item !== productId);
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
}


export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item === productId);
        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(item => item !== productId);
                await user.save();
                return res.json(user.cartItems);
            }
            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating quantity' });
    }
}

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } });
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.id === product.id);
            return {...product.toJSON(), quantity: item.quantity }; 
        })
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart products' });
    }
}
