import { AlertTriangle, CheckCircle2, Wallet } from 'lucide-react';
import { currency } from '../utils/format.js';

export default function BudgetProgress({ budget, compact = false }) {
  const percent = Math.min(budget.percent || 0, 100);
  const status = budget.status || 'unset';

  const palette = {
    ok: { from: 'from-emerald-500', to: 'to-teal-500', text: 'text-emerald-500', icon: CheckCircle2, label: 'On track' },
    warning: { from: 'from-amber-500', to: 'to-orange-500', text: 'text-amber-500', icon: AlertTriangle, label: 'Approaching limit' },
    exceeded: { from: 'from-rose-500', to: 'to-pink-500', text: 'text-rose-500', icon: AlertTriangle, label: 'Budget exceeded' },
    unset: { from: 'from-slate-400', to: 'to-slate-500', text: 'text-slate-500', icon: Wallet, label: 'No budget set' },
  };

  const tone = palette[status];
  const Icon = tone.icon;

  if (budget.amount === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">No budget set</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Head to the Budget page to set a monthly limit.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${compact ? 'p-4' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Monthly budget
          </p>
          <p className="mt-1 text-xl font-bold">
            {currency(budget.spent)} <span className="text-slate-400 text-base font-medium">/ {currency(budget.amount)}</span>
          </p>
        </div>
        <span className={`chip ${tone.text} bg-white/70 dark:bg-white/5`}>
          <Icon className="h-3.5 w-3.5" />
          {tone.label}
        </span>
      </div>

      <div className="mt-4 h-3 rounded-full bg-slate-200/70 dark:bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${tone.from} ${tone.to} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{Math.round(budget.percent)}% used</span>
        <span>
          {budget.remaining >= 0
            ? `${currency(budget.remaining)} remaining`
            : `${currency(Math.abs(budget.remaining))} over`}
        </span>
      </div>
    </div>
  );
}
