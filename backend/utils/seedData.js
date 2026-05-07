require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const today = new Date();
const daysAgo = (n) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - n);
const monthsAgo = (n) => new Date(today.getFullYear(), today.getMonth() - n, 15);

const sample = [
  { title: 'Monthly Salary', amount: 4500, type: 'income', category: 'Salary', note: 'November payroll', date: daysAgo(2) },
  { title: 'Freelance Project', amount: 850, type: 'income', category: 'Salary', note: 'Logo design', date: daysAgo(8) },
  { title: 'Groceries — Whole Foods', amount: 124.5, type: 'expense', category: 'Food', note: 'Weekly grocery run', date: daysAgo(1) },
  { title: 'Dinner with friends', amount: 62, type: 'expense', category: 'Food', note: '', date: daysAgo(4) },
  { title: 'Amazon order', amount: 89.99, type: 'expense', category: 'Shopping', note: 'Headphones', date: daysAgo(5) },
  { title: 'New shoes', amount: 119, type: 'expense', category: 'Shopping', note: '', date: daysAgo(11) },
  { title: 'Uber ride', amount: 18.4, type: 'expense', category: 'Travel', note: 'Airport', date: daysAgo(3) },
  { title: 'Flight to Boston', amount: 280, type: 'expense', category: 'Travel', note: 'Conference', date: daysAgo(20) },
  { title: 'Electric bill', amount: 96, type: 'expense', category: 'Bills', note: '', date: daysAgo(7) },
  { title: 'Internet', amount: 55, type: 'expense', category: 'Bills', note: 'Fiber plan', date: daysAgo(9) },
  { title: 'Netflix', amount: 15.49, type: 'expense', category: 'Entertainment', note: '', date: daysAgo(6) },
  { title: 'Movie night', amount: 32, type: 'expense', category: 'Entertainment', note: 'IMAX', date: daysAgo(10) },
  { title: 'Coffee', amount: 5.75, type: 'expense', category: 'Food', note: '', date: daysAgo(0) },
  { title: 'Last month salary', amount: 4500, type: 'income', category: 'Salary', note: '', date: monthsAgo(1) },
  { title: 'Last month groceries', amount: 410, type: 'expense', category: 'Food', note: '', date: monthsAgo(1) },
  { title: 'Last month rent', amount: 1200, type: 'expense', category: 'Bills', note: '', date: monthsAgo(1) },
  { title: 'Two months ago salary', amount: 4500, type: 'income', category: 'Salary', note: '', date: monthsAgo(2) },
  { title: 'Two months ago shopping', amount: 230, type: 'expense', category: 'Shopping', note: '', date: monthsAgo(2) },
];

const seed = async () => {
  await connectDB();
  await Transaction.deleteMany({});
  await Budget.deleteMany({});
  await Transaction.insertMany(sample);

  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  await Budget.create({ month: monthKey, amount: 2000 });

  console.log(`Seeded ${sample.length} transactions and a $2000 budget for ${monthKey}.`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
