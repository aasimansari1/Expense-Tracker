const mongoose = require('mongoose');

const CATEGORIES = [
  'Food',
  'Shopping',
  'Travel',
  'Bills',
  'Salary',
  'Entertainment',
  'Other',
];

const TRANSACTION_TYPES = ['income', 'expense'];

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    type: {
      type: String,
      required: true,
      enum: TRANSACTION_TYPES,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
      default: 'Other',
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.TRANSACTION_TYPES = TRANSACTION_TYPES;
