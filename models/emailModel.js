import mongoose from 'mongoose'

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

const emailModel = mongoose.models.email || mongoose.model('email', emailSchema);

export default emailModel