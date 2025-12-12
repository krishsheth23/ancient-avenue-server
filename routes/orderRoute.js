import express from 'express';
import { 
    placeOrder,
    removeOrders, 
    placeOrderStripe, 
    placeOrderRazorpay, 
    allOrders,
    getAllOrders, 
    userOrders, 
    updateStatus, 
    verifyStripe, 
    verifyRazorpay, 
    getDashboardMetrics 
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);            
orderRouter.post('/status', adminAuth, updateStatus);       
orderRouter.delete('/remove-order', adminAuth, removeOrders);
orderRouter.get('/allorders', adminAuth, getAllOrders);

// Admin Dashboard Metrics Route
orderRouter.get('/dashboard-metrics', adminAuth, getDashboardMetrics);  // Dashboard metrics for admin

// Payment Features
orderRouter.post('/place', authUser, placeOrder);                // Placing orders using COD
orderRouter.post('/stripe', authUser, placeOrderStripe);    // Placing orders using Stripe
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);  // Placing orders using Razorpay

// User Features
orderRouter.post('/userorders', authUser, userOrders);  // User can view their orders

// Verify Payments
orderRouter.post('/verifyStripe', authUser, verifyStripe);       // Verifying Stripe payments
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);   // Verifying Razorpay payments


export default orderRouter;
