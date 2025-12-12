import express from 'express'
import { subscribeEmail, getAllSubscriptions,emailRemove } from '../controllers/emailController.js';

const emailRouter = express.Router();
// Route to handle email subscription from the frontend
emailRouter.post('/subscribe', subscribeEmail);
// Route to fetch all subscriptions (for the admin panel)
emailRouter.get('/subscriptions', getAllSubscriptions);
// Route to remove email ID from admin panel
emailRouter.delete('/remove', emailRemove);

export default emailRouter