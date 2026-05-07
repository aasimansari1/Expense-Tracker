import { useMemo, useState } from 'react';
import { Plus, Search, Download, ArrowUpDown } from 'lucide-react';
import TransactionList from '../components/TransactionList.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import Loader from '../components/Loader.jsx';
import { useTransactions } from '../context/TransactionContext.jsx';
import { exportTransactionsPdf } from '../utils/exportPdf.js';

const CATEGORIES = ['All', 'Food', 'Shopping', 'Travel', 'Bills', 'Salary', 'Entertainment', 'Other'];
const TYPES = ['All', 'income', 'expense'];

export default function Transactions() {
  const { transactions, loading, deleteTransaction } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('desc');

  const filtered = useMemo(() => {
    let list = transactions.slice();
    if (category !== 'All') list = list.filter((t) => t.category === category);
    if (type !== 'All') list = list.filter((t) => t.type === type);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.note || '').toLowerCase().includes(q)
      );
    }
    if (from) list = list.filter((t) => new Date(t.date) >= new Date(from));
    if (to) list = list.filter((t) => new Date(t.date) <= new Date(to));
    list.sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return sort === 'asc' ? diff : -diff;
    });
    return list;
  }, [transactions, category, type, search, from, to, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage every income and expense
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportTransactionsPdf(filtered)} className="btn-secondary">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      <div className="card space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
            placeholder="Search by title or note…"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="label">Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All' : t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">From</label>
            <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="label">To</label>
            <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label className="label">Sort</label>
            <button
              onClick={() => setSort((s) => (s === 'desc' ? 'asc' : 'desc'))}
              className="input flex items-center justify-between"
            >
              <span>{sort === 'desc' ? 'Latest first' : 'Oldest first'}</span>
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Showing {filtered.length} of {transactions.length}
        </p>
        {loading ? (
          <Loader rows={6} />
        ) : (
          <TransactionList
            items={filtered}
            onEdit={(t) => { setEditing(t); setShowForm(true); }}
            onDelete={(t) => {
              if (confirm(`Delete "${t.title}"?`)) deleteTransaction(t._id);
            }}
          />
        )}
      </div>

      <TransactionForm
        open={showForm}
        initial={editing}
        onClose={() => { setShowForm(false); setEditing(null); }}
      />
    </div>
  );
}
