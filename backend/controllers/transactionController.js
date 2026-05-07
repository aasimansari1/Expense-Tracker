const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');

const getTransactions = asyncHandler(async (req, res) => {
  const { category, type, search, from, to, sort = 'desc' } = req.query;

  const query = {};
  if (category && category !== 'All') query.category = category;
  if (type && type !== 'All') query.type = type;
  if (search) query.title = { $regex: search, $options: 'i' };
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const sortOrder = sort === 'asc' ? 1 : -1;
  const transactions = await Transaction.find(query).sort({ date: sortOrder, createdAt: sortOrder });

  res.json({ success: true, count: transactions.length, data: transactions });
});

const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  res.json({ success: true, data: transaction });
});

const createTransaction = asyncHandler(async (req, res) => {
  const { title, amount, type, category, note, date } = req.body;
  const transaction = await Transaction.create({
    title,
    amount,
    type,
    category,
    note,
    date: date || Date.now(),
  });
  res.status(201).json({ success: true, data: transaction });
});

const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  res.json({ success: true, data: transaction });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  res.json({ success: true, data: {} });
});

const getStats = asyncHandler(async (req, res) => {
  const all = await Transaction.find();
  const totalIncome = all
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = all
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const categoryBreakdown = await Transaction.aggregate([
    { $match: { type: 'expense' } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
  ]);

  const monthly = await Transaction.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown,
      monthly,
    },
  });
});

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
};
