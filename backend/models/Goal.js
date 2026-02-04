const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Goal name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Target amount is required'],
        min: [0, 'Target amount cannot be negative']
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: [0, 'Current amount cannot be negative']
    },
    targetDate: {
        type: Date,
        required: [true, 'Target date is required']
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual for progress percentage
goalSchema.virtual('progress').get(function () {
    if (this.targetAmount === 0) return 100;
    return Math.min(100, Math.round((this.currentAmount / this.targetAmount) * 100));
});

// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function () {
    return Math.max(0, this.targetAmount - this.currentAmount);
});

// Ensure virtuals are included in JSON output
goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

goalSchema.index({ userId: 1, isDeleted: 1 });

module.exports = mongoose.model('Goal', goalSchema);
