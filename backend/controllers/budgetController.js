const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');

const currentMonthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getBudget = asyncHandler(async (req, res) => {
  const month = req.query.month || currentMonthKey();
  let budget = await Budget.findOne({ month });
  if (!budget) {
    budget = { month, amount: 0 };
  }

  const [year, m] = month.split('-').map(Number);
  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 1);

  const txns = await Transaction.find({
    type: 'expense',
    date: { $gte: start, $lt: end },
  });

  const spent = txns.reduce((acc, t) => acc + t.amount, 0);
  const remaining = (budget.amount || 0) - spent;
  const percent = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 999) : 0;
  const status = budget.amount === 0 ? 'unset' : spent > budget.amount ? 'exceeded' : percent >= 80 ? 'warning' : 'ok';

  res.json({
    success: true,
    data: {
      month,
      amount: budget.amount,
      spent,
      remaining,
      percent: Math.round(percent * 10) / 10,
      status,
    },
  });
});

const setBudget = asyncHandler(async (req, res) => {
  const { month = currentMonthKey(), amount } = req.body;
  if (typeof amount !== 'number' || amount < 0) {
    res.status(400);
    throw new Error('Amount must be a non-negative number');
  }
  const budget = await Budget.findOneAndUpdate(
    { month },
    { amount },
    { new: true, upsert: true, runValidators: true }
  );
  res.status(201).json({ success: true, data: budget });
});

module.exports = { getBudget, setBudget };
