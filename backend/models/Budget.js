const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Budget amount is required'],
        min: [0, 'Budget amount cannot be negative']
    },
    period: {
        type: String,
        enum: ['monthly', 'weekly'],
        default: 'monthly'
    }
}, {
    timestamps: true
});

// Unique constraint: one budget per category per user
budgetSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
