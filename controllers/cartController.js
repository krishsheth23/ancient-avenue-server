import userModel from "../models/userModel.js"

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        const qty = Number(quantity) || 1;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {}; // Initialize cartData if it doesn't exist

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += qty;
            } else {
                cartData[itemId][size] = qty;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = qty;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {}; // Initialize cartData if it doesn't exist

        if (!cartData[itemId] || !cartData[itemId][size]) {
            return res.json({ success: false, message: "Item or size not found in cart" });
        }

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart }