import emailModel from "../models/emailModel.js";

// Subscribe Email Handler
const subscribeEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email already exists
        const existingSubscription = await emailModel.findOne({ email });
        if (existingSubscription) {
            return res.status(400).json({ message: 'This email is already subscribed!' });
        }

        // Create a new email subscription
        const newSubscription = new emailModel({ email });
        await newSubscription.save();

        res.status(201).json({ message: 'Successfully subscribed!' });
    } catch (error) {
        console.log('Error details:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Get All Subscriptions Handler
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await emailModel.find();
        res.status(200).json(subscriptions);
    } catch (error) {
        console.log('Error details:', error);
        res.status(500).json({ message: 'Error fetching subscriptions' });
    }
};

const emailRemove = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email address is required." });
    }

    try {
        const result = await emailModel.findOneAndDelete({ email });
        if (!result) {
            return res.status(404).json({ success: false, message: "Email address not found." });
        }
        res.json({ success: true, message: "Email address removed successfully." });
    } catch (error) {
        console.error('Email removal error:', error);
        res.status(500).json({ success: false, message: 'Error removing email address.' });
    }       
}

export { subscribeEmail, getAllSubscriptions, emailRemove }