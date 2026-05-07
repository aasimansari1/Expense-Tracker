import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext.jsx';

const CATEGORIES = ['Food', 'Shopping', 'Travel', 'Bills', 'Salary', 'Entertainment', 'Other'];

const empty = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  note: '',
  date: new Date().toISOString().slice(0, 10),
};

export default function TransactionForm({ open, onClose, initial }) {
  const { addTransaction, updateTransaction } = useTransactions();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && initial) {
      setForm({
        title: initial.title,
        amount: initial.amount,
        type: initial.type,
        category: initial.category,
        note: initial.note || '',
        date: new Date(initial.date).toISOString().slice(0, 10),
      });
    } else if (open) {
      setForm(empty);
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0) return;
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (initial) await updateTransaction(initial._id, payload);
      else await addTransaction(payload);
      onClose();
    } catch (err) {
      // toast already handled
    } finally {
      setSaving(false);
    }
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg glass rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {initial ? 'Edit transaction' : 'Add transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-white/10"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: 'expense', category: f.category === 'Salary' ? 'Other' : f.category }))}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
                form.type === 'expense'
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/80'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: 'income', category: 'Salary' }))}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
                form.type === 'income'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/80'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={form.title}
              onChange={update('title')}
              placeholder="e.g. Groceries"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={update('amount')}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="label">Date</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={update('date')}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={update('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Note (optional)</label>
            <textarea
              className="input min-h-[72px] resize-none"
              value={form.note}
              onChange={update('note')}
              placeholder="Add a note..."
              maxLength={500}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving…' : initial ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
