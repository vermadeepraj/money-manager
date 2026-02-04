const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    emoji: {
        type: String,
        required: [true, 'Emoji is required'],
        maxlength: 4
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Type is required']
    },
    division: {
        type: String,
        enum: ['personal', 'office'],
        required: [true, 'Division is required']
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // null for default categories
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index for querying user's categories
categorySchema.index({ userId: 1, isDeleted: 1 });
categorySchema.index({ isDefault: 1 });

module.exports = mongoose.model('Category', categorySchema);
