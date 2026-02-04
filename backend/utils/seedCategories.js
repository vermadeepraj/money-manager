require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const defaultCategories = [
    // Income - Personal
    { name: 'Salary', emoji: '💰', type: 'income', division: 'personal', isDefault: true },
    { name: 'Freelance', emoji: '💼', type: 'income', division: 'personal', isDefault: true },
    { name: 'Investment', emoji: '📈', type: 'income', division: 'personal', isDefault: true },
    { name: 'Gifts', emoji: '🎁', type: 'income', division: 'personal', isDefault: true },
    { name: 'Other Income', emoji: '💵', type: 'income', division: 'personal', isDefault: true },

    // Income - Office
    { name: 'Business Income', emoji: '💼', type: 'income', division: 'office', isDefault: true },
    { name: 'Reimbursement', emoji: '📊', type: 'income', division: 'office', isDefault: true },

    // Expense - Personal
    { name: 'Food & Dining', emoji: '🍔', type: 'expense', division: 'personal', isDefault: true },
    { name: 'Fuel & Transport', emoji: '⛽', type: 'expense', division: 'personal', isDefault: true },
    { name: 'Medical & Health', emoji: '💊', type: 'expense', division: 'personal', isDefault: true },
    { name: 'Entertainment', emoji: '🎬', type: 'expense', division: 'personal', isDefault: true },
    { name: 'Utilities', emoji: '🏠', type: 'expense', division: 'personal', isDefault: true },
    { name: 'Shopping', emoji: '👔', type: 'expense', division: 'personal', isDefault: true },
    { name: 'Travel', emoji: '✈️', type: 'expense', division: 'personal', isDefault: true },
    { name: 'Education', emoji: '📚', type: 'expense', division: 'personal', isDefault: true },
    { name: 'Other Expense', emoji: '📝', type: 'expense', division: 'personal', isDefault: true },

    // Expense - Office
    { name: 'Office Supplies', emoji: '📎', type: 'expense', division: 'office', isDefault: true },
    { name: 'Business Transport', emoji: '🚗', type: 'expense', division: 'office', isDefault: true },
    { name: 'Client Meals', emoji: '🍽️', type: 'expense', division: 'office', isDefault: true },
    { name: 'Subscriptions', emoji: '📱', type: 'expense', division: 'office', isDefault: true },
    { name: 'Office Other', emoji: '📋', type: 'expense', division: 'office', isDefault: true },

    // Transfer category (special)
    { name: 'Transfer', emoji: '🔄', type: 'expense', division: 'personal', isDefault: true }
];

const seedCategories = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if default categories already exist
        const existingCount = await Category.countDocuments({ isDefault: true });

        if (existingCount > 0) {
            console.log(`Default categories already exist (${existingCount} found). Skipping seed.`);
            await mongoose.disconnect();
            return;
        }

        // Insert default categories
        const result = await Category.insertMany(defaultCategories);
        console.log(`Successfully seeded ${result.length} default categories`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedCategories();
}

module.exports = { seedCategories, defaultCategories };
