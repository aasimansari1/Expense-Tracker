import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Wallet, X, Sparkles } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/analytics', label: 'Analytics', icon: PieChart },
  { to: '/budget', label: 'Budget', icon: Wallet },
];

const linkClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-gradient-brand text-white shadow-glow'
      : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/5'
  }`;

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full glass border-r border-white/30 dark:border-white/10 m-3 lg:m-4 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold leading-none">Expensy</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Smart finance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-1.5">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass} onClick={onClose}>
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4">
            <div className="rounded-2xl p-4 bg-gradient-brand text-white shadow-glow">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Pro Tip</p>
              <p className="text-sm mt-1 leading-snug">
                Set a monthly budget to keep your expenses on track.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
