import { useMemo, useState } from 'react';
import { Wallet, TrendingDown, TrendingUp, Plus, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import SummaryCard from '../components/SummaryCard.jsx';
import TransactionList from '../components/TransactionList.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import BudgetProgress from '../components/BudgetProgress.jsx';
import Loader from '../components/Loader.jsx';
import { useTransactions } from '../context/TransactionContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { currency } from '../utils/format.js';
import { exportMonthlyReportPdf } from '../utils/exportPdf.js';

export default function Dashboard() {
  const { transactions, stats, budget, loading, deleteTransaction } = useTransactions();
  const { theme } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const recent = transactions.slice(0, 6);

  const monthlyData = useMemo(() => {
    const map = new Map();
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      const entry = map.get(key) || { key, label, income: 0, expense: 0 };
      if (t.type === 'income') entry.income += t.amount;
      else entry.expense += t.amount;
      map.set(key, entry);
    });
    return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key)).slice(-6);
  }, [transactions]);

  const grid = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const text = theme === 'dark' ? '#94a3b8' : '#475569';

  const monthKey = new Date().toISOString().slice(0, 7);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your finance overview at a glance
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportMonthlyReportPdf(transactions, { month: monthKey })}
            className="btn-secondary"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add transaction</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          icon={Wallet}
          label="Total balance"
          value={stats.balance}
          accent="brand"
          sub="Income minus expense"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Total income"
          value={stats.totalIncome}
          accent="green"
        />
        <SummaryCard
          icon={TrendingDown}
          label="Total expenses"
          value={stats.totalExpense}
          accent="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Monthly summary</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last 6 months — income vs expense
              </p>
            </div>
          </div>
          {loading ? (
            <Loader rows={4} />
          ) : monthlyData.length === 0 ? (
            <p className="text-sm text-slate-500">Add transactions to see your monthly chart.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                  <XAxis dataKey="label" stroke={text} fontSize={12} />
                  <YAxis stroke={text} fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      background: theme === 'dark' ? '#1e293b' : '#ffffff',
                      color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
                      boxShadow: '0 10px 30px rgba(15,23,42,0.15)',
                    }}
                    formatter={(v) => currency(v)}
                  />
                  <Bar dataKey="income" radius={[6, 6, 0, 0]}>
                    {monthlyData.map((_, i) => (
                      <Cell key={`inc-${i}`} fill="#10b981" />
                    ))}
                  </Bar>
                  <Bar dataKey="expense" radius={[6, 6, 0, 0]}>
                    {monthlyData.map((_, i) => (
                      <Cell key={`exp-${i}`} fill="#ef4444" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <BudgetProgress budget={budget} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Recent transactions</h2>
          <a href="/transactions" className="text-sm text-brand-500 hover:underline">
            View all →
          </a>
        </div>
        {loading ? (
          <Loader rows={4} />
        ) : (
          <TransactionList
            items={recent}
            onEdit={(t) => { setEditing(t); setShowForm(true); }}
            onDelete={(t) => {
              if (confirm(`Delete "${t.title}"?`)) deleteTransaction(t._id);
            }}
            emptyMessage="No transactions yet — add your first one!"
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
