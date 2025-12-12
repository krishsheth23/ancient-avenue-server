import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from 'stripe';
import razorpay from 'razorpay';

// global variables
const currency = 'inr';
const deliveryCharge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Reduce product quantities for COD orders
        for (const item of items) {
            await productModel.findByIdAndUpdate(item._id, {
                $inc: { quantity: -item.quantity }
            });
        }

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const removeOrders = async (req, res) => {
    try {
        const { orderId } = req.body; // Expecting the orderId to be sent in the request body
        
        // Check if orderId is provided
        if (!orderId) {
            return res.json({ success: false, message: 'Order ID is required' });
        }

        // Find and delete the order
        const deletedOrder = await orderModel.findByIdAndDelete(orderId);

        // Check if the order was found and deleted
        if (!deletedOrder) {
            return res.json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order removed successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            
            // Reduce product quantities for successful Stripe payment
            const order = await orderModel.findById(orderId);
            for (const item of order.items) {
                await productModel.findByIdAndUpdate(item._id, {
                    $inc: { quantity: -item.quantity }
                });
            }
            
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }

}

//  Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
        
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString() 
        }

        await razorpayInstance.orders.create(options, (error,order)=>{
            if (error) {
                console.log(error)
                return res.json({success:false, message: error})
            }
            res.json({success:true,order})
        })

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const verifyRazorpay = async (req,res) => {
    try {
        
        const { userId, razorpay_order_id } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            
            // Reduce product quantities for successful Razorpay payment
            const order = await orderModel.findById(orderInfo.receipt);
            for (const item of order.items) {
                await productModel.findByIdAndUpdate(item._id, {
                    $inc: { quantity: -item.quantity }
                });
            }
            
            res.json({success: true, message: "Payment Successfull"})
        } else {
            res.json({success: false, message: "Payment Failed"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get All Orders Data for Preparing Invoice
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});  
        res.status(200).json({ success: true, orders });  
    } catch (error) {
        console.error(error);  // Log the error
        res.status(500).json({ success: false, message: error.message });  
    }
};

// User Order Data for FrontEnd
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true, orders})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// Update Order Status from Admin
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Controller for fetching dashboard metrics
const getDashboardMetrics = async (req, res) => {
    try {
        // Use Promise.all to run multiple database queries concurrently for better performance
        const [totalOrders, deliveredOrders, totalRevenueResult, pendingOrders] = await Promise.all([
            orderModel.countDocuments({}), // Total orders placed
            orderModel.countDocuments({ status: 'Delivered' }), // Orders delivered
            orderModel.aggregate([ // Total revenue from delivered orders
                { $match: { status: 'Delivered' } },
                { $group: { _id: null, total: { $sum: '$amount' } } } // Assuming 'amount' is the correct field name
            ]),
            orderModel.countDocuments({
                status: { $in: ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery'] } // Pending orders
            })
        ]);

        const totalRevenue = totalRevenueResult.length ? totalRevenueResult[0].total : 0;

        res.json({
            success: true,
            metrics: {
                totalOrders,
                deliveredOrders,
                pendingOrders,
                totalRevenue
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard metrics' });
    }
};

export {
    placeOrder,
    removeOrders,
    placeOrderStripe,
    placeOrderRazorpay,
    verifyRazorpay,
    verifyStripe,
    userOrders,
    getAllOrders,
    allOrders,
    updateStatus,
    getDashboardMetrics,
};