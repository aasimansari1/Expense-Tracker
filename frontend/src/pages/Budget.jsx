import { useState } from 'react';
import { Save, Wallet } from 'lucide-react';
import BudgetProgress from '../components/BudgetProgress.jsx';
import { useTransactions } from '../context/TransactionContext.jsx';
import { currency, monthLabel } from '../utils/format.js';

export default function Budget() {
  const { budget, saveBudget } = useTransactions();
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (amount === '' || Number(amount) < 0) return;
    setSaving(true);
    try {
      await saveBudget(Number(amount));
      setAmount('');
    } finally {
      setSaving(false);
    }
  };

  const presets = [500, 1000, 1500, 2000, 3000, 5000];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Budget</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {budget.month ? `For ${monthLabel(budget.month)}` : 'Manage your monthly limit'}
        </p>
      </div>

      <BudgetProgress budget={budget} />

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Set monthly budget</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Current: {currency(budget.amount)}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Budget amount (USD)</label>
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 2000"
              required
            />
          </div>

          <div>
            <p className="label">Quick presets</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setAmount(String(p))}
                  className="chip bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save budget'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="font-semibold">How it works</h3>
        <ul className="mt-2 text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
          <li>Your budget applies to the current calendar month.</li>
          <li>Spending is calculated from your <em>expense</em> transactions only.</li>
          <li>You'll see a warning chip once you cross 80% of your limit.</li>
          <li>Going over your budget shows a clear "exceeded" indicator.</li>
        </ul>
      </div>
    </div>
  );
}
