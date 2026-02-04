const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Account name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    type: {
        type: String,
        enum: ['bank', 'cash', 'wallet'],
        required: [true, 'Account type is required']
    },
    balance: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index for querying user's accounts
accountSchema.index({ userId: 1, isDeleted: 1 });

module.exports = mongoose.model('Account', accountSchema);
